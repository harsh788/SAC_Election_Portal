import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Button, Form } from "reactstrap";

const Votes = () => {
    const [votes, setVotes] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [students, setStudents] = useState([]);
    const [voteID, setVoteID] = useState(0);
    const [edit, setEdit] = useState(false);
    const [electionCandidates, setElectionCandidates] = useState([]);
    const [updatedCandidate, setUpdatedCandidate] = useState('');

    const toggleEditStudent = (id) => {
        setEdit(!edit);
        setVoteID(id);
    }

    const handleEdit = e => {
        setUpdatedCandidate(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`http://localhost:5000/dashboard/vote/${voteID}/update`, {
            method: 'POST',
            mode: 'cors',
            credentials:"same-origin",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                choice: updatedCandidate,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Form data sent:', data);
            // Handle success, reset form, show success message, etc.
        })
        .catch(error => {
            console.error('Error sending form data:', error);
            // Handle error, show error message, etc.
        });

        toggleEditStudent(0);
    }

    useEffect(() => {
        const fetchVotes = async () => {
            try {
                let data = await fetch("http://localhost:5000/dashboard/votes");
                let json = await data.json();
                let votesJson = json.vote_list;
                let candidatesJson = json.candidate_list;
                let studentsJson = json.student_list;

                setVotes(votesJson);
                setCandidates(candidatesJson);
                setStudents(studentsJson);
            } catch(errors) {
                console.log(errors);
            }
        }
        const fetchEditDetails = async () => {
            try {
                let data = await fetch(`http://localhost:5000/dashboard/vote/${voteID}/update`);
                let json = await data.json();

                setElectionCandidates(json.candidate_list);
                console.log(electionCandidates);
            } catch(errors) {
                console.log(errors);
            }
        }

        fetchVotes();
        if(edit) {
            fetchEditDetails();
        }
    }, [edit]);

    return (
        <div className="flex">
            <div className="row">
                <Sidebar />
                <div className="col-10" style={{textAlign: "center", padding:10}}>
                    <h2>Votes Registered</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-2"></div>
                <div className="col-10">
                    <ul>
                        {votes.map((vote, index) => (
                            <li key={index}>
                                <strong>{students[index].name}</strong> voted for <strong>{candidates[index].first_name}</strong> on {vote.timestamp}. &ensp; 
                                <span onClick={() => toggleEditStudent(vote._id)} style={{color: 'red', fontWeight: 'bold', cursor: 'pointer'}}>Edit</span>
                            </li>
                        ))}
                    </ul>
                    <br />
                    {edit && <Form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="choice">Select a candidate</label>
                            <select className="form-control" id="choice" name="choice" onChange={handleEdit}>
                                {electionCandidates.map((candidate, index) => (
                                    <option key={index} value={candidate.roll_number}>{candidate.first_name} {candidate.last_name}</option>
                                ))}
                            </select>
                        </div>
                        <Button type="submit" color="primary">Submit</Button>
                    </Form>}
                </div>
            </div>
        </div>
    );
}

export default Votes;