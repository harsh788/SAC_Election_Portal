const Student = require("../models/student");
const Candidate = require("../models/candidate");
const Vote = require("../models/vote");
const Election = require("../models/election");
const asyncHandler = require("express-async-handler");

// Home page
exports.index = asyncHandler(async (req, res, next) => {
    // Getting details of students, candidates, votes, election counts (in parellel)
    const [
        numStudents,
        numCandidates,
        numVotes, 
        numElections,
    ] = await Promise.all([
        Student.countDocuments({}).exec(),
        Candidate.countDocuments({}).exec(),
        Vote.countDocuments({}).exec(),
        Election.countDocuments({}).exec(),
    ]);

    res.render("index", {
        title: "SAC Election Portal",
        student_count: numStudents,
        candidate_count: numCandidates,
        vote_count: numVotes,
        election_count: numElections,
    });
});

// Display all the ongoing elections
exports.election_list = asyncHandler(async (req, res, next) => {
    const allElections = await Election.find().exec();

    res.render("election_list", {
        title: "Ongoing elections",
        election_list: allElections,
    });
});

// Display the stats for a particular election
exports.election_stats_get = asyncHandler(async (req, res, next) => {
    const election = await Election.findById(req.params.id).exec();
    let votes = new Map();

    for(let index=0;index<election.votes.length;index++) {
        const vote = await Vote.findById(election.votes[index]).exec();
        const candidate = await Candidate.findById(vote.selection, "first_name").exec();

        if(votes.has(candidate.first_name)) {
            votes.set(candidate.first_name, votes.get(candidate.first_name)+1);
        } else {
            votes.set(candidate.first_name, 1);
        }
    }
    console.log(votes);

    res.render("election_stats", {
        title: election.title,
        votes: Object.fromEntries(votes),
    });
});

// Cast a vote (GET)
exports.election_vote_get = asyncHandler(async (req, res, next) => {
    const election_detail = await Election.findById(req.params.id).exec();
    let candidate_list = [];

    for(index=0;index<election_detail.candidates.length;index++) {
        candidate_list.push(await Candidate.findById(election_detail.candidates[index]).exec());
    }

    res.render("election_vote", {
        title: "Cast a vote",
        election: election_detail,
        candidates: candidate_list,
    });
});

// Cast a vote (POST)
exports.election_vote_post = asyncHandler(async (req, res, next) => {
    // Checking whether the voter is authorised to vote
    const voter = await Student.findOne({ roll_number: req.body.voter_roll_number });
    if(voter===null) {
        // Invalid student details. Rerender the form
        const election_detail = await Election.findById(req.params.id).exec();
        let candidate_list = [];

        for(index=0;index<election_detail.candidates.length;index++) {
            candidate_list.push(await Candidate.findById(election_detail.candidates[index]).exec());
        }

        res.render("election_vote", {
            title: "Cast a vote",
            election: election_detail,
            candidate_list: candidate_list,
            errors: "Student with roll number " + req.body.voter_roll_number + " is not authorised to vote."
        });
    }

    const candidate = await Candidate.findOne({ roll_number: req.body.choice });
    
    const vote = new Vote({
        voter: voter,
        timestamp: new Date(),
        selection: candidate,
        election: await Election.findById(req.params.id).exec(),
    });
    await vote.save();
    res.redirect('/dashboard');
});

// Create new election (GET)
exports.election_create_get = asyncHandler(async (req, res, next) => {

});

// Create new election (POST)
exports.election_create_post = asyncHandler(async (req, res, next) => {

});
