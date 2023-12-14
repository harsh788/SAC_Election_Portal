const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Vote Controller', () => {

    // test vote_list function
    describe('/GET vote_list', () => {
        it('it should display list of all votes', (done) => {
            chai.request('http://localhost:5000')
            .get('/dashboard/votes')
            .end((err, res) => {
                if(err){
                    console.error(err);
                    return done(err);
                }

                if(typeof res.body === 'object' && res.body !== null){
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('title').eql('List of all the votes');
                    expect(res.body).to.have.property('vote_list');
                    expect(res.body).to.have.property('candidate_list');
                    expect(res.body).to.have.property('student_list');
                    done();
                }
                else{
                    done(new Error('Unexpected response body format'));
                }
            });
        });
    });
});

describe('Student Controller', () => {

    // test student_list function
    describe('/GET studennt_list', () => {
        it('it should GET the list of all students', (done) => {
            chai.request('http://localhost:5000')
            .get('/dashboard/students')
            .end((err, res) => {
                if(err){
                    console.error(err);
                    return done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
        });
    });

    // test student_detail function
    describe('/GET student_detail/:id', () => {
        it('it should return a 500 status for an invalid ID', (done) => {
            const student_id = '657744ad4a78ab65f4ea2c';
            chai.request('http://localhost:5000')
            .get('/dashboard/student/' + student_id)
            .end((err, res) => {
                if(err){
                    console.error(err);
                    return done(err);
                }

                expect(res).to.have.status(500);
                done();
            });
        });
    });
});

describe('Candidate Controller', () => {
    
    // test candidate_list function
    describe('/GET candidate_list', () => {
        it('it should GET a list of all candidates', (done) => {
            chai.request('http://localhost:5000')
            .get('/dashboard/candidates')
            .end((err, res) => {
                if(err){
                    console.error(err);
                    return done(err);
                }

                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
        });
    });
});
