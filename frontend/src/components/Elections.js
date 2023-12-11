import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardText, CardBody, Button } from 'reactstrap';
import {Link} from 'react-router-dom';
import Sidebar from './Sidebar';
import AddVote from './AddVote';

function RenderElectionItem({ election, votes }) {
    const [adding, setAdding] = useState(false);
    const toggleAdding = () => {
        setAdding(!adding);
    }

    return (
        <div>
            {!adding && <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 10 }}>
                <h3>{election.title}</h3>
                <CardBody>
                    <div style={{ textAlign: 'center' }}>
                        Number of candidates: {election.candidates.length} <br />
                        Number of voters: {election.voter_list.length} <br />
                        Number of votes already registered: {election.votes.length} <br />
                    </div>
                </CardBody>
                <h4>Standings</h4>
                <CardBody>
                    <ul>
                        {Object.entries(votes).map(([candidate, count], index) => (
                            <li key={index}><strong>{candidate}:</strong> {count}</li>
                        ))}
                    </ul>
                </CardBody>
                <Button type="submit" color="primary" onClick={toggleAdding}>
                    Vote
                </Button>
            </Card>}
            {adding && <AddVote electionID={election._id} toggleAdding={toggleAdding}/>}
        </div>
    );
}

const Elections = () => {
    const [elections, setElections] = useState([]);
    const [votes, setVotes] = useState([]);

    // Fetching election data
    useEffect(() => {
        // Fetch all the elections
        const fetchElections = async () => {
            try {
                let data = await fetch("http://localhost:5000/dashboard/elections");
                let json = await data.json();
                let electionJson = json.elections;
                let voteJson = json.votes;

                setElections(electionJson);
                setVotes(voteJson);
            } catch(errors) {
                console.log(errors);
            }
        }
        fetchElections();
    }, []);

    const electionlist = elections.map((election, index) => {
        return (
            <div key={election._id} className="col-12 col-md-3 m-1">
                <RenderElectionItem election={election} votes={votes[index]}/>
            </div>
        );
    });
    
    return (
        <div className='flex'>
            <div className="row">
                <Sidebar />
                <div className='col-10' style={{textAlign: 'center', padding: 10}}>
                    <h2>Ongoing Elections</h2>
                </div>
            </div>
            <div className='row'>
                <div className='col-2'></div>
                {electionlist}
            </div>
        </div>
    );
}

export default Elections;