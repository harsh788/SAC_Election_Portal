const Student = require("../models/student");
const Vote = require("../models/vote");
const Candidate = require("../models/candidate");
const Election = require("../models/election");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
    const allElections = await Election.find({}, "title").exec();
    
    res.render("student_form", {
        title: "Add student",
        election_list: allElections,
    });
});

// Add a new student (POST)
exports.student_create_post = [
    // Sanitization and validation
    body("name")
      .trim()
      .isLength({min: 3})
      .escape()
      .withMessage("The name is too short"),
    body("roll_number")
      .trim()
      .isLength({min: 9, max: 10})
      .escape()
      .withMessage("Invalid roll number"),
    body("batch").escape(),

    // Process request after sanitization and validation
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const student = new Student({
            name: req.body.name,
            roll_number: req.body.roll_number,
            batch: req.body.batch,
        });

        if(!errors.isEmpty()) {
            res.render("student_form", {
                title: "Add student",
                errors: errors.array(),
                student: student,
            });
        } else {
            const election = await Election.findOne({title: req.body.choice});
            election.voter_list.push(student);
            await election.save();

            await student.save();
            res.redirect("/dashboard");
        }
    })
]

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