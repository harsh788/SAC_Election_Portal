const chai = require('chai');
const chaiHttp = require('chai-http');
const logger = require('../logger');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Vote_Controller', () => {

    // test vote_list function
    describe('/GET vote_list', () => {
        it('it should display list of all votes', (done) => {
            chai.request('http://localhost:5000')
            .get('/dashboard/votes')
            .end((err, res) => {
                if(err){
                    // console.error(err);
                    logger.error('Error during test: ' + toString(err));
                    logger.error('Test failed');
                    return done(err);
                }

                if(typeof res.body === 'object' && res.body !== null){
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('title').eql('List of all the votes');
                    expect(res.body).to.have.property('vote_list');
                    expect(res.body).to.have.property('candidate_list');
                    expect(res.body).to.have.property('student_list');
                    done();

                    logger.info('Test passed');
                }
                else{
                    done(new Error('Unexpected response body format'));
                    logger.error('Unexpected response body format');
                    logger.error('Test failed');
                }
            });
        });
    });

    // test vote_update_get function
    describe('/GET vote_update_get/:id', () => {
        it('it should GET updated vote details', (done) => {
            const voteID = '657744ad4a78ab65f4ea2c44';
            chai.request('http://localhost:5000')
            .get('/dashboard/vote/' + voteID + '/update')
            .end((err, res) => {
                if(err){
                    console.error(err);
                    return done(err);
                }

                if(typeof res.body === 'object' && res.body !== null){
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('candidate_list').to.be.an('array');
                    done();
                }
                else{
                    done(new Error('Unexpected response body format'));
                }
            });
        });
    });

    // test vote_update_post function
    
});
