import React, { useState, useEffect } from "react";
import { Form, FormGroup, Input, Label, Col, Button } from "reactstrap";

const DeleteStudent = (props) => {
    const [studentRollNo, setStudentRollNo] = useState("");
    const [studentID, setStudentID] = useState(0);
    const [studentDetails, setStudentDetails] = useState(null);
    const [flag, setFlag] = useState(true);

    const handleChange = e => {
        const {value} = e.target;
        setStudentRollNo(value);
    }

    const handleSubmitGet = e => {
        e.preventDefault();

        const std = props.studentList.find(student => student.roll_number === studentRollNo);
        if(std === undefined) {
            alert("Student not found");
            return;
        } else {
            setStudentID(std._id);
        }
    }

    const handleSubmitPost = e => {
        props.toggleDeleteStudent();

        e.preventDefault();

        fetch(`http://localhost:5000/dashboard/student/${studentID}/delete`, {
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

    // Fetching the student details whenever the student changes
    useEffect(() => {
        const fetchStudentDetails = async () => {
            if(studentID === 0) return;
            let data = await fetch(`http://localhost:5000/dashboard/student/${studentID}/delete`);
            let json = await data.json();

            setStudentDetails(json);
            setFlag(false);
        }

        fetchStudentDetails();
    }, [studentID]);

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
                            value={studentRollNo}
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
                <h3>Student Details</h3>
                <p>Name: {studentDetails.student.name}</p>
                <p>Roll Number: {studentDetails.student.roll_number}</p>
                <p>Batch: {studentDetails.student.batch}</p>

                <p>The following votes involving {studentDetails.student.name} will be deleted</p>
                <ul>
                    {studentDetails.vote_list.map((vote, index) => (
                        <li key={index}>
                            <p><strong>{studentDetails.student.name}</strong> voted for <strong>{studentDetails.candidate_name[index].first_name}</strong> on {vote.timestamp}</p>
                        </li>
                    ))}
                </ul>
                <p>The following elections involving {studentDetails.student.name} will be updated</p>
                <ul>
                    {studentDetails.election_list.map((election, index) => (
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
    )
}

export default DeleteStudent;