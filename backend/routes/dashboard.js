const express = require("express");
const router = express.Router();

// Models
const student_controller = require("../controllers/studentController");
const candidate_controller = require("../controllers/candidateController");
const vote_controller = require("../controllers/voteController");
const election_controller = require("../controllers/electionController");
const auth_controller = require('../controllers/authController');
const authenticateToken = require("../authenticate");

// ------ Election routes ------

// GET dashboard home page
router.get("/", election_controller.index);

// GET request for creating an election
router.get("/election/create", election_controller.election_create_get);

// POST request for creating an election
router.post("/election/create", election_controller.election_create_post);

// GET request for casting a vote to a particular election
router.get("/election/:id", election_controller.election_vote_get);

// POST request for casting a vote to a particular election
router.post("/election/:id", election_controller.election_vote_post);

// GET request for election standings
router.get("/election/:id/stats", election_controller.election_stats_get);

// GET request for list of all elections
router.get("/elections", election_controller.election_list);


// ------ Student routes ------

// GET request for adding new student
router.get("/student/create", student_controller.student_create_get);

// POST request for adding new student
router.post("/student/create", student_controller.student_create_post);

// GET request for deleting student
router.get("/student/:id/delete", student_controller.student_delete_get);

// POST request for deleting student
router.post("/student/:id/delete", student_controller.student_delete_post);

// GET request for updating student
router.get("/student/:id/update", student_controller.student_update_get);

// POST request for updating student
router.post("/student/:id/update", student_controller.student_update_post);

// GET request for a particular student
router.get("/student/:id", student_controller.student_detail);

// GET request for list of all students
router.get("/students", authenticateToken, student_controller.student_list);


// ------ Candidate routes ------

// GET request for adding new candidate
router.get("/candidate/create", candidate_controller.candidate_create_get);

// POST request for adding new candidate
router.post("/candidate/create", candidate_controller.candidate_create_post);

// GET request for deleting candidate
router.get("/candidate/:id/delete", candidate_controller.candidate_delete_get);

// POST request for deleting candidate
router.post("/candidate/:id/delete", candidate_controller.candidate_delete_post);

// GET request for updating candidate
router.get("/candidate/:id/update", candidate_controller.candidate_update_get);

// POST request for updating candidate
router.post("/candidate/:id/update", candidate_controller.candidate_update_post);

// GET request for a particular candidate
router.get("/candidate/:id", candidate_controller.candidate_detail);

// GET request for list of all candidates
router.get("/candidates", candidate_controller.candidate_list);


// ------ Vote routes ------

// GET request for updating vote
router.get("/vote/:id/update", vote_controller.vote_update_get);

// POST request for updating vote
router.post("/vote/:id/update", vote_controller.vote_update_post);

// GET request for list of all votes
router.get("/votes", vote_controller.vote_list);


// ------ Login routes ------

// POST request for signup
router.post("/signup", auth_controller.signup_post);

// POST request for login
router.post("/login", auth_controller.login_post);

module.exports = router;
