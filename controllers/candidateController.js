const Candidate = require("../models/candidate");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all candidates
exports.candidate_list = asyncHandler(async (req, res, next) => {
    const allCandidates = await Candidate.find().sort({first_name: 1}).exec();

    res.render("candidate_list", {
        title: "Candidates standing for the election",
        candidate_list: allCandidates,
    });
});

// Display detail page for a candidate
exports.candidate_detail = asyncHandler(async (req, res, next) => {
    const candidate = await Candidate.findById(req.params.id).exec();

    if(candidate === null) {
        const err = new Error("Candidate not found");
        err.status = 404;
        return next(err);
    }

    res.render("candidate_detail", {
        title: "Candidate watch",
        candidate: candidate,
    });
});

// Add a new candidate (GET)
exports.candidate_create_get = asyncHandler(async (req, res, next) => {
    res.render("candidate_form", {title: "Add new candidate"});
});

// Add a new candidate (POST)
exports.candidate_create_post = [
    body("first_name", "First Name too short").trim().isLength({min:3}).escape(),
    body("last_name", "Last Name too short").trim().isLength({min:3}).escape(),
    body("roll_number", "Invalid roll number").trim().isLength({min: 9, max: 10}).escape(),
    body("batch").escape(),
    body("message").escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const candidate = new Candidate({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            roll_number: req.body.roll_number,
            batch: req.body.batch,
            message: req.body.message,
        });

        if(!errors.isEmpty()) {
            res.render("candidate_form", {
                title: "Add new candidate",
                errors: errors.array(),
                candidate: candidate,
            });
        } else {
            await candidate.save();
            res.redirect(candidate.url);
        }
    })
]

// Delete a candidate (GET)
exports.candidate_delete_get = asyncHandler(async (req, res, next) => {

});

// Delete a candidate (POST)
exports.candidate_delete_post = asyncHandler(async (req, res, next) => {

});

// Update a candidate (GET)
exports.candidate_update_get = asyncHandler(async (req, res, next) => {

});

// Update a candidate (POST)
exports.candidate_update_post = asyncHandler(async (req, res, next) => {

});