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

});

// Display the details of an election
exports.election_detail = asyncHandler(async (req, res, next) => {

});

// Create new election (GET)
exports.election_create_get = asyncHandler(async (req, res, next) => {

});

// Create new election (POST)
exports.election_create_post = asyncHandler(async (req, res, next) => {

});
