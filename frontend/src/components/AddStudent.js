import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Label, Input, FormGroup } from "reactstrap";

const AddStudent = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        roll_number: '',
        batch: '',
        choice: ''
    });
    const [electionsList, setElectionsList] = useState([]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
    };

    const handleSubmit = e => {
        props.toggleAddStudent();

        e.preventDefault();
    
        fetch('http://localhost:5000/dashboard/student/create', {
            method: 'POST',
            mode: "cors",
            credentials:"same-origin",
            headers: {
                'Content-Type': 'application/json',
                'authorization': sessionStorage.getItem('token'),
            },
            body: JSON.stringify(formData)
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
    };

    // Get the list of elections
    useEffect(() => {
        const fetchElections = async () => {
            let data = await fetch("http://localhost:5000/dashboard/student/create");
            let json = await data.json();
            
            setElectionsList(json);
        }

        fetchElections();
    }, []);

    return (
        <div style={{padding: 10}}>
            <Form onSubmit={handleSubmit}>
                <FormGroup row>
                    <Label htmlFor="name" md={2}>Name</Label>
                    <Col md={10}>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="roll_number" sm={2}>
                        Roll Number
                    </Label>
                    <Col sm={10}>
                        <Input
                            type="text"
                            name="roll_number"
                            id="roll_number"
                            placeholder="Enter Roll Number"
                            value={formData.roll_number}
                            onChange={handleChange}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="batch" sm={2}>
                        Batch
                    </Label>
                    <Col sm={10}>
                        <Input
                            type="select"
                            name="batch"
                            id="batch"
                            value={formData.batch}
                            onChange={handleChange}
                        >
                            <option value="">Select Batch</option>
                            <option value="IMT2020">IMT2020</option>
                            <option value="IMT2019">IMT2019</option>
                            <option value="MT2022">MT2022</option>
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="choice" sm={2}>
                        Election
                    </Label>
                    <Col sm={10}>
                        <Input
                            type="select"
                            name="choice"
                            id="choice"
                            value={formData.choice}
                            onChange={handleChange}
                        >
                            <option value="">Select Election</option>
                            {electionsList.map((election, index) => (
                                <option key={index} value={election.title}>
                                    {election.title}
                                </option>
                            ))}
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup check row>
                    <Col sm={{ offset: 10 }}>
                        <Button color="primary" type="submit">
                            Post
                        </Button>
                    </Col>
                </FormGroup>
            </Form>
        </div>
    );
}

export default AddStudent;