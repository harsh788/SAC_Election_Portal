import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

const Participants = () => {
    const [students, setStudents] = useState([]);
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                let data = await fetch("http://localhost:3000/dashboard/students");
                let json = await data.json();

                setStudents(json);
            } catch(errors) {
                console.log(errors);
            }
        }
        const fetchCandidates = async () => {
            try {
                let data = await fetch("http://localhost:3000/dashboard/candidates");
                let json = await data.json();

                setCandidates(json);
            } catch(errors) {
                console.log(errors);
            }
        }

        fetchStudents();
        fetchCandidates();
    }, []);

    const StudentList = () => {
        return (
            <div className="col-md-5" style={{padding: 10}}>
                <h5>Students</h5>
                <ul style={{listStyleType: "square"}}>
                    {students.map((student, index) => (
                        <li key={index}>
                            <strong>Name: </strong>{student.name} &ensp;
                            <strong>Roll Number: </strong>{student.roll_number} &ensp;
                            <strong>Batch: </strong>{student.batch} &ensp;
                        </li>
                    ))}
                </ul>
                <Link to={`/dashboard/election/`}>
                    <Button type="submit" color="primary">
                        Add Student
                    </Button>
                </Link>
            </div>
        );
    }

    const CandidateList = () => {
        return(
            <div className="col-md-5" style={{padding: 10}}>
                <h5>Candidates</h5>
                <ul style={{listStyleType: "square"}}>
                    {candidates.map((candidate, index) => (
                        <li key={index}>
                            <strong>Name: </strong>{candidate.first_name} {candidate.last_name} &ensp;
                            <strong>Roll Number: </strong>{candidate.roll_number} &ensp;
                            <strong>Batch: </strong>{candidate.batch} &ensp;
                            <br />
                            <p>Message: {candidate.message}</p>
                        </li>
                    ))}
                </ul>
                <Link to={`/dashboard/election/`}>
                    <Button type="submit" color="primary">
                        Add Candidate
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className='flex'>
            <div className="row">
                <Sidebar />
                <div className='col-10' style={{textAlign: 'center', padding: 10}}>
                    <h2>List of all Participants</h2>
                    <h4>(Students and Candidates)</h4>
                </div>
            </div>
            <div className="row">
                <div className="col-md-2"></div>
                <StudentList />
                <CandidateList />
            </div>
        </div>
    );
}

export default Participants;