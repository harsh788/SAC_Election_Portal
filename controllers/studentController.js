const Student = require("../models/student");
const Vote = require("../models/vote");
const Candidate = require("../models/candidate");
const asyncHandler = require("express-async-handler");

// Display list of all students
exports.student_list = asyncHandler(async (req, res, next) => {
    const allStudents = await Student.find().sort({ roll_number: 1, name: 1 }).exec();

    res.render("student_list", {
        title: "Registered students",
        student_list: allStudents,
    });
});

// Display detail page for a student
exports.student_detail = asyncHandler(async (req, res, next) => {
    const [student, voteByStudent] = await Promise.all([
        Student.findById(req.params.id).exec(),
        Vote.findOne({ voter: req.params.id }).exec(),
    ]);
    if(student === null) {
        const err = new Error("Student not found");
        err.status = 404;
        return next(err);
    }
    
    const candidate = (voteByStudent===null ? null : await Candidate.findById(voteByStudent.selection).exec());

    res.render("student_detail", {
        title: "Student detail",
        student: student,
        student_vote: candidate,
    });
});

// Add a new student (GET)
exports.student_create_get = asyncHandler(async (req, res, next) => {

});

// Add a new student (POST)
exports.student_create_post = asyncHandler(async (req, res, next) => {

});

// Delete a student (GET)
exports.student_delete_get = asyncHandler(async (req, res, next) => {

});

// Delete a student (POST)
exports.student_delete_post = asyncHandler(async (req, res, next) => {

});

// Update a student (GET)
exports.student_update_get = asyncHandler(async (req, res, next) => {

});

// Update a student (POST)
exports.student_update_post = asyncHandler(async (req, res, next) => {

});