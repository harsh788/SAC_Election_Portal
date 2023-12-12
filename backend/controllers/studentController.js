const Student = require("../models/student");
const Vote = require("../models/vote");
const Candidate = require("../models/candidate");
const Election = require("../models/election");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const logger = require("../logger");

// Display list of all students
exports.student_list = asyncHandler(async (req, res, next) => {
    logger.info("GET request for student list");
    const allStudents = await Student.find().sort({ roll_number: 1, name: 1 }).exec();

    res.json(allStudents);
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
        logger.error(err);
        return next(err);
    }
    logger.info(`GET request for student detail with roll number: ${student.roll_number}`);

    const candidate = (voteByStudent===null ? null : await Candidate.findById(voteByStudent.selection).exec());

    res.render("student_detail", {
        title: "Student detail",
        student: student,
        student_vote: candidate,
    });
});

// Add a new student (GET)
exports.student_create_get = asyncHandler(async (req, res, next) => {
    logger.info("GET request for student create");
    const allElections = await Election.find({}, "title").exec();

    res.json(allElections);
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
        logger.info("POST request for student create");
        const errors = validationResult(req);

        const student = new Student({
            name: req.body.name,
            roll_number: req.body.roll_number,
            batch: req.body.batch,
        });

        if(!errors.isEmpty()) {
            logger.error(errors);
            res.json({ title: "Add student", errors: errors.array(), student: student })
        } else {
            const election = await Election.findOne({title: req.body.choice});
            election.voter_list.push(student);
            await election.save();

            await student.save();
            res.status(200);
        }
    })
]

// Delete a student (GET)
exports.student_delete_get = asyncHandler(async (req, res, next) => {
    const student = await Student.findById(req.params.id).exec();

    if(!student) {
        const err = new Error("Student not found");
        err.status = 404;
        logger.error(`Student not found`);
        return next(err);
    }

    const vote_list = await Vote.find({voter: student}).exec();
    const election_list = await Election.find({voter_list: student}, "title").exec();
    logger.info(`GET request for student delete with roll number: ${student.roll_number}`);

    let candidate_name = [];
    for(let index=0;index<vote_list.length;index++) {
        candidate_name.push(await Candidate.findById(vote_list[index].selection, "first_name").exec());
    }

    if(candidate_name.length !== 0) {
        logger.warn(`The student has voted for the following candidates: ${candidate_name.map(candidate => candidate.first_name)}`);
    }
    logger.warn(`The student has voted in the following elections: ${election_list.map(election => election.title)}`);

    res.json({
        title: "Delete student entry",
        student: student,
        vote_list: vote_list,
        candidate_name: candidate_name,
        election_list: election_list,
    });
});

// Delete a student (POST)
exports.student_delete_post = asyncHandler(async (req, res, next) => {
    const student = await Student.findById(req.params.id).exec();
    const vote_list = await Vote.find({voter: student}).exec();
    const election_list = await Election.find({voter_list: student}, "title").exec();
    logger.info(`POST request for student delete with roll number: ${student.roll_number}`);

    // Update the vote list and candidate list of the elections which involves the student to be deleted
    for(index=0;index<election_list.length;index++) {
        let old_election = election_list[index];
        const updatedElection = await Election.findByIdAndUpdate(
            old_election.id,
            {
                $pull: {
                    votes: { $in: vote_list }, // Remove votes present in vote_list
                    voter_list: student._id // Remove the specific student
                }
            },
            { new: true } // To return the updated document
        );
    }

    // Delete votes from vote_list which involves the student to be deleted.
    for(index=0;index<vote_list.length;index++) {
        await Vote.findByIdAndDelete(vote_list[index].id);
    }

    // Delete the student
    await Student.findByIdAndDelete(req.params.id);
    res.status(200);
});

// Update a student (GET)
exports.student_update_get = asyncHandler(async (req, res, next) => {

});

// Update a student (POST)
exports.student_update_post = asyncHandler(async (req, res, next) => {

});