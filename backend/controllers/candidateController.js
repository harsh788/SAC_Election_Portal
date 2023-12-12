const Candidate = require("../models/candidate");
const Vote = require("../models/vote");
const Election = require("../models/election");
const Student = require("../models/student");
const mongoose = require('mongoose');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const logger = require("../logger");

// Display list of all candidates
exports.candidate_list = asyncHandler(async (req, res, next) => {
    logger.info("GET request for candidate list");
    const allCandidates = await Candidate.find().sort({first_name: 1}).exec();

    res.json(allCandidates);
});

// Display detail page for a candidate
exports.candidate_detail = asyncHandler(async (req, res, next) => {
    const candidate = await Candidate.findById(req.params.id).exec();

    if(candidate === null) {
        const err = new Error("Candidate not found");
        err.status = 404;
        logger.error(err);
        return next(err);
    }
    logger.info(`GET request for candidate detail with roll number: ${candidate.roll_number}`);

    res.render("candidate_detail", {
        title: "Candidate watch",
        candidate: candidate,
    });
});

// Add a new candidate (GET)
exports.candidate_create_get = asyncHandler(async (req, res, next) => {
    logger.info("GET request for candidate create");
    const allElections = await Election.find({}, "title").exec();

    res.json(allElections);
});

// Add a new candidate (POST)
exports.candidate_create_post = [
    body("first_name", "First Name too short").trim().isLength({min:3}).escape(),
    body("last_name", "Last Name too short").trim().isLength({min:3}).escape(),
    body("roll_number", "Invalid roll number").trim().isLength({min: 9, max: 10}).escape(),
    body("batch").escape(),
    body("message").escape(),

    asyncHandler(async (req, res, next) => {
        logger.info("POST request for candidate create");
        const errors = validationResult(req);

        const candidate = new Candidate({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            roll_number: req.body.roll_number,
            batch: req.body.batch,
            message: req.body.message,
        });

        if(!errors.isEmpty()) {
            const allElections = await Election.find({}, "title").exec();
            logger.error(errors);
            res.json({
                title: "Add new candidate",
                errors: errors.array(),
                candidate: candidate,
                election_list: allElections,
            })
        } else {
            // Adding candidate to election's candidate list
            const election = await Election.findOne({title: req.body.choice});
            election.candidates.push(candidate);
            await election.save();
            
            await candidate.save();
            res.status(200);
        }
    })
]

// Delete a candidate (GET)
exports.candidate_delete_get = asyncHandler(async (req, res, next) => {
    const candidate = await Candidate.findById(req.params.id).exec();
    const vote_list = await Vote.find({selection: candidate}).exec();
    const election_list = await Election.find({candidates: candidate}, "title").exec();
    logger.info(`GET request for candidate delete with roll number: ${candidate.roll_number}`);
    
    let student_name = [];
    for(let index=0;index<vote_list.length;index++) {
        student_name.push(await Student.findById(vote_list[index].voter, "name").exec());
    }

    logger.warn(`Candidate ${candidate.roll_number} has ${vote_list.length} votes`);
    logger.warn(`Candidate ${candidate.first_name} ${candidate.last_name} is present in the following elections: ${election_list.map(election => election.title)}`)

    res.json({
        title: "Delete candidate entry",
        candidate: candidate,
        vote_list: vote_list,
        student_name: student_name,
        election_list: election_list,
    });
});

// Delete a candidate (POST)
exports.candidate_delete_post = asyncHandler(async (req, res, next) => {
    const candidate = await Candidate.findById(req.params.id).exec();
    const vote_list = await Vote.find({selection: candidate}).exec();
    const election_list = await Election.find({candidates: candidate}).exec();
    logger.info(`POST request for candidate delete with roll number: ${candidate.roll_number}`)

    // Update the vote list and candidate list of the elections which involves the candidate to be deleted
    for(index=0;index<election_list.length;index++) {
        let old_election = election_list[index];
        const updatedElection = await Election.findByIdAndUpdate(
            old_election.id,
            {
                $pull: {
                    votes: { $in: vote_list }, // Remove votes present in vote_list
                    candidates: candidate._id // Remove the specific candidate
                }
            },
            { new: true } // To return the updated document
        );
    }
    // Delete votes from vote_list which involves the candidate to be deleted.
    for(index=0;index<vote_list.length;index++) {
        await Vote.findByIdAndDelete(vote_list[index].id);
    }

    // Delete the candidate.
    await Candidate.findByIdAndDelete(req.params.id);
    res.status(200);
});

// Update a candidate (GET)
exports.candidate_update_get = asyncHandler(async (req, res, next) => {

});

// Update a candidate (POST)
exports.candidate_update_post = asyncHandler(async (req, res, next) => {

});