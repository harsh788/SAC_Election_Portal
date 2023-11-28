import React, { useState, useEffect } from "react";
import { Form, FormGroup, Input, Label, Col, Button } from "reactstrap";

const DeleteCandidate = (props) => {
    const [candidateRollNo, setCandidateRollNo] = useState("");
    const [candidateID, setCandidateID] = useState(0);
    const [candidateDetails, setCandidateDetails] = useState(null);
    const [flag, setFlag] = useState(true);

    const handleChange = e => {
        const {value} = e.target;
        setCandidateRollNo(value);
    }

    const handleSubmitGet = e => {
        e.preventDefault();

        const cdt = props.candidateList.find(candidate => candidate.roll_number === candidateRollNo);
        if(cdt === undefined) {
            alert("Candidate not found");
            return;
        } else {
            setCandidateID(cdt._id);
        }
    }

    const handleSubmitPost = e => {
        props.toggleDeleteCandidate();

        e.preventDefault();

        fetch(`http://localhost:3000/dashboard/candidate/${candidateID}/delete`, {
            method: 'POST',
            mode: "cors",
            credentials:"same-origin",
            headers: {
                'Content-Type': 'application/json'
            },
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
    }

    // Fetching the candidate details whenever the candidate changes
    useEffect(() => {
        const fetchCandidateDetails = async () => {
            if(candidateID === 0) return;
            let data = await fetch(`http://localhost:3000/dashboard/candidate/${candidateID}/delete`);
            let json = await data.json();

            setCandidateDetails(json);
            setFlag(false);
        }

        fetchCandidateDetails();
    }, [candidateID]);

    return (
        <div style={{padding: 10}}>
            {flag && <Form onSubmit={handleSubmitGet}>
                <FormGroup row>
                    <Label htmlFor="roll_number" md={2}>Roll Number</Label>
                    <Col md={10}>
                        <Input
                            type="text"
                            name="roll_number"
                            id="roll_number"
                            placeholder="Enter Roll Number"
                            value={candidateRollNo}
                            onChange={handleChange}
                        />
                    </Col>
                </FormGroup>
                <FormGroup check row>
                    <Col sm={{ offset: 10 }}>
                        <Button color="primary" type="submit">
                            Find
                        </Button>
                    </Col>
                </FormGroup>
            </Form>}
            {!flag && <div>
                <h3>Candidate Details</h3>
                <p>Name: {candidateDetails.candidate.first_name} {candidateDetails.candidate.last_name}</p>    
                <p>Roll Number: {candidateDetails.candidate.roll_number}</p>
                <p>Batch: {candidateDetails.candidate.batch}</p>

                <p>The following votes involving {candidateDetails.candidate.first_name} will be deleted</p>
                <ul>
                    {candidateDetails.vote_list.map((vote, index) => (
                        <li key={index}>
                            <p><strong>{candidateDetails.student_name[index].name}</strong> voted for <strong>{candidateDetails.candidate.first_name}</strong> on {vote.timestamp}</p>
                        </li>
                    ))}
                </ul>
                <p>The following elections involving {candidateDetails.candidate.first_name} will be updated</p>
                <ul>
                    {candidateDetails.election_list.map((election, index) => (
                        <li key={index}>
                            <p><strong>{election.title}</strong></p>
                        </li>
                    ))}
                </ul>
                <Button color="danger" onClick={handleSubmitPost}>
                    Delete
                </Button>
            </div>}
        </div>
    );
}

export default DeleteCandidate;