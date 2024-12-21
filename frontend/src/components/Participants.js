import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import AddStudent from './AddStudent';
import AddCandidate from './AddCandidate';
import DeleteStudent from './DeleteStudent';
import DeleteCandidate from './DeleteCandidate';

const Participants = () => {
    const [students, setStudents] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [addStudent, setAddStudent] = useState(false);
    const [addCandidate, setAddCandidate] = useState(false);
    const [deleteStudent, setDeleteStudent] = useState(false);
    const [deleteCandidate, setDeleteCandidate] = useState(false);

    const toggleAddStudent = () => {
        setAddStudent(!addStudent);
    }
    const toggleAddCandidate = () => {
        setAddCandidate(!addCandidate);
    }
    const toggleDeleteStudent = () => {
        setDeleteStudent(!deleteStudent);
    }
    const toggleDeleteCandidate = () => {
        setDeleteCandidate(!deleteCandidate);
    }

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                let data = await fetch("http://localhost:5000/dashboard/students", {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    }
                });
                let json = await data.json();

                setStudents(json);
            } catch(errors) {
                console.log(errors);
            }
        }
        const fetchCandidates = async () => {
            try {
                let data = await fetch("http://localhost:5000/dashboard/candidates");
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
                <Button type="submit" color="primary" onClick={toggleAddStudent} style={{marginRight: 10}}>
                    Add Student
                </Button>
                <Button type="submit" color="primary" onClick={toggleDeleteStudent}>
                    Delete Student
                </Button>
                <br />
                {addStudent && <AddStudent toggleAddStudent={toggleAddStudent}/>}
                {deleteStudent && <DeleteStudent studentList={students} toggleDeleteStudent={toggleDeleteStudent}/>}
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
                <Button type="submit" color="primary" onClick={toggleAddCandidate} style={{marginRight: 10}}>
                    Add Candidate
                </Button>
                <Button type="submit" color="primary" onClick={toggleDeleteCandidate}>
                    Delete Candidate
                </Button>
                <br />
                {addCandidate && <AddCandidate toggleAddCandidate={toggleAddCandidate}/>}
                {deleteCandidate && <DeleteCandidate candidateList={candidates} toggleDeleteCandidate={toggleDeleteCandidate}/>}
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