import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { Button, Form, Row, Col, Label, Input, FormGroup } from "reactstrap";

const Login = (props) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        roll_number: '',
        password: '',
    });

    const handleChange = e => {
        const {name, value} = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();

        fetch('http://localhost:5000/dashboard/login', {
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if(!response.ok) {
                throw new Error('Network response was not ok', response.message);
            }
            return response.json();
        })
        .then(data => {
            // console.log('Form data sent:', data);

            const token = data.token;
            sessionStorage.setItem('token', token);
            // localStorage.setItem('token', token);

            navigate('/');
        })
        .catch(error => {
            console.log('Error sending form data:', error);
        });
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
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
                    <Label for="password" sm={2}>
                        Password
                    </Label>
                    <Col sm={10}>
                        <Input
                            type="text"
                            name="password"
                            id="password"
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
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
    )
}

export default Login;