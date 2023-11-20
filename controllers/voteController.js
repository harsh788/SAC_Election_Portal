const Vote = require("../models/vote");
const Student = require("../models/student");
const Candidate = require("../models/candidate");
const asyncHandler = require("express-async-handler");

// Display list of all votes (display all information here)
exports.vote_list = asyncHandler(async (req, res, next) => {
    const allVotes = await Vote.find().sort({ timestamp: 1 }).exec();
    
    let allCandidates = [], allStudents = [];
    for(let index=0;index<allVotes.length;index++) {
        allCandidates.push(await Candidate.findById(allVotes[index].selection).exec());
        allStudents.push(await Student.findById(allVotes[index].voter).exec());
    }
    // console.log(allStudents);
    res.render("vote_list", {
        title: "List of all the votes",
        vote_list: allVotes,
        candidate_list: allCandidates,
        student_list: allStudents,
    });
});

// Create a new vote (POST)
exports.vote_create = asyncHandler(async (req, res, next) => {

});