const Vote = require("../models/vote");
const Student = require("../models/student");
const Candidate = require("../models/candidate");
const asyncHandler = require("express-async-handler");
const Election = require("../models/election");
const logger = require("../logger");

// Display list of all votes (display all information here)
exports.vote_list = asyncHandler(async (req, res, next) => {
    logger.info("GET request for vote list");
    const allVotes = await Vote.find().sort({ timestamp: 1 }).exec();
    
    let allCandidates = [], allStudents = [];
    for(let index=0;index<allVotes.length;index++) {
        allCandidates.push(await Candidate.findById(allVotes[index].selection, "first_name").exec());
        allStudents.push(await Student.findById(allVotes[index].voter, "name").exec());
    }
    
    res.json({
        title: "List of all the votes",
        vote_list: allVotes,
        candidate_list: allCandidates,
        student_list: allStudents,
    });
});

// Update a new vote (GET)
exports.vote_update_get = asyncHandler(async (req, res, next) => {
    const vote = await Vote.findById(req.params.id).exec();
    const election = await Election.findOne({votes: vote}, "candidates").exec();
    logger.info(`GET request for updating a vote`);

    let candidate_list = [];
    for(let index=0;index<election.candidates.length;index++) {
        candidate_list.push(await Candidate.findOne(election.candidates[index]));
    }

    res.json({candidate_list: candidate_list});
});

// Update a new vote (POST)
exports.vote_update_post = asyncHandler(async (req, res, next) => {
    const old_vote = await Vote.findById(req.params.id).exec();
    const election = await Election.findOne({votes: old_vote}).exec();
    const candidate = await Candidate.findOne({roll_number: req.body.choice});
    logger.info(`POST request for updating a vote`);

    // Updating the vote list in Election
    const voteIndex = election.votes.findIndex(vote => vote._id.toString()===old_vote._id.toString());

    election.votes[voteIndex].selection = candidate;
    await election.save();

    // Updating the particular vote
    await Vote.findByIdAndUpdate(req.params.id, {
        voter: old_vote.voter,
        timestamp: new Date(),
        selection: candidate,
    });

    res.redirect("/dashboard/votes");
});