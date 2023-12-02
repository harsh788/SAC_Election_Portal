#! /usr/bin/env node

console.log('This script populates some students, candidates, votes, election, and candidates to the database.');

const userArgs = process.argv.slice(2);

const Student = require("./models/student");
const Candidate = require("./models/candidate");
const Vote = require("./models/vote");
const Election = require("./models/election");

const students = [];
const candidates = [];
const votes = [];
const elections = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = "mongodb://localhost:27017/myDB";

main().catch((err) => console.log(err));
async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createStudents();
    await createCandidates();
    await createVotes();
    await createElections();
    console.log("Debug: Closing the connection");
    mongoose.connection.close();
}

async function studentCreate(index, name, roll_number, batch) {
    const studentdetail = {
        name: name,
        roll_number: roll_number,
        batch: batch,
    };
    const student = new Student(studentdetail);
    await student.save();
    students[index] = student;
    console.log(`Added student: ${name}`);
}

async function candidateCreate(index, fname, lname, roll_number, batch, message) {
    const candidatedetail = {
        first_name: fname,
        last_name: lname,
        roll_number: roll_number,
        batch: batch,
        message: message,
    };
    const candidate = new Candidate(candidatedetail);
    await candidate.save();
    candidates[index] = candidate;
    console.log(`Added candidate: ${fname} ${lname}`);
}

async function voteCreate(index, voter, selection) {
    const votedetail = {
        voter: voter,
        timestamp: new Date(),
        selection: selection,
    };
    const vote = new Vote(votedetail);
    await vote.save();
    votes[index] = vote;
    console.log(`Added vote: ${selection.first_name}`);
}

async function electionCreate(index, title, students, votes, candidates) {
    const electiondetail = {
        title: title,
        voter_list: students,
        votes: votes,
        candidates: candidates,
    };
    const election = new Election(electiondetail);
    await election.save();
    elections[index] = election;
    console.log(`Added election: ${title}`);
}

async function createStudents() {
    console.log("Adding students");
    await Promise.all([
        studentCreate(0, "Anwit", "IMT2020532", "IMT2020"),
        studentCreate(1, "Darshak", "IMT2020119", "IMT2020"),
        studentCreate(2, "Anurag", "IMT2020093", "IMT2020"),
        studentCreate(3, "Prem", "IMT2020044", "IMT2020"),
        studentCreate(4, "Arya", "IMT2020084", "IMT2020"),
        studentCreate(5, "Anshul", "MT2022069", "MT2022"),
    ]);
}

async function createCandidates() {
    console.log("Adding candidates");
    await Promise.all([
        candidateCreate(0, "Mayank", "Chadha", "IMT2020045", "IMT2020", "She don't know"),
        candidateCreate(1, "Shridhar", "Sharma", "IMT2020065", "IMT2020", "Loreum ipsum"),
        candidateCreate(2, "Jacob", "Mathew", "MT2022150", "MT2022", "Hello world"),
    ])
}

async function createVotes() {
    console.log("Adding votes");
    await Promise.all([
        voteCreate(0, students[3], candidates[2]),
        voteCreate(1, students[2], candidates[1]),
        voteCreate(2, students[4], candidates[0]),
        voteCreate(3, students[5], candidates[0]),
    ]);
}

async function createElections() {
    console.log("Adding elections");
    await Promise.all([
        electionCreate(0, "SAC 2023", students, votes, candidates),
    ]);
}
