import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Form, FormGroup, Col, Label, Input } from 'reactstrap';

const AddVote = (props) => {
    const [election, setElection] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [choice, setChoice] = useState('');
    const [voter_roll_number, setVoter_roll_number] = useState('');

    const handleCandidateChange = e => {
        setChoice(e.target.value);
    }

    const handleRollNumberChange = e => {
        setVoter_roll_number(e.target.value);
    }

    const handleVoteSubmit = e => {
        props.toggleAdding();

        e.preventDefault();

        fetch(`http://localhost:5000/dashboard/election/${props.electionID}`, {
            method: 'POST',
            mode: 'cors',
            credentials:"same-origin",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                voter_roll_number: voter_roll_number,
                choice: choice,
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
    }

    useEffect(() => {
        const fetchElectionData = async () => {
            try{
                let data = await fetch(`http://localhost:5000/dashboard/election/${props.electionID}`);
                let json = await data.json();
                let elec = json.election;
                let cand = json.candidates;

                setElection(elec);
                setCandidates(cand);
                // console.log(election);
                // console.log(candidates);
            } catch(errors) {
                console.log(errors);
            }
        }
        fetchElectionData();
    }, []);

    return (
        <Card>
            <h3>{election && election.title}</h3>
            <CardBody>
                <Form onSubmit={handleVoteSubmit}>
                    <FormGroup row>
                        <Label htmlFor="voter_roll_number">Roll Number</Label>
                        <Col>
                            <Input
                                type="text"
                                name="voter_roll_number"
                                id="voter_roll_number"
                                placeholder="Enter Your Roll Number"
                                value={voter_roll_number}
                                onChange={handleRollNumberChange}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="choice">
                            Select Candidate
                        </Label>
                        <Col>
                        <Input
                            type="select"
                            name="choice"
                            id="choice"
                            value={choice}
                            onChange={handleCandidateChange}
                        >
                            <option value="">Select a Candidate</option>
                            {candidates.map((candidate) => (
                                <option key={candidate.roll_number} value={candidate.roll_number}>
                                    {candidate.first_name} {candidate.last_name}
                                </option>
                            ))}
                        </Input>
                    </Col>
                    </FormGroup>
                    <FormGroup check row>
                        <Col sm={{offset: 8}}>
                            <Button color="primary" type="submit">
                                Add Vote
                            </Button>
                        </Col>
                    </FormGroup>
                </Form>
            </CardBody>
        </Card>
    );
}

export default AddVote;