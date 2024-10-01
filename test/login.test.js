const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); 
const expect = chai.expect;
const client = require('../dbConnection');

chai.use(chaiHttp);


const clearCollections = async () => {
    const authCollection = client.db().collection('auths');
    const usersCollection = client.db().collection('users');
    
    await authCollection.deleteMany({});
    await usersCollection.deleteMany({});
};


describe('User Login', () => {
    before(async () => {
        await clearCollections(); 
   
        await chai.request(server)
            .post('/register')
            .send({ email: 'login@example.com', password: 'Password1!', username: 'loginuser' });
    });

    after(async () => {
        await clearCollections(); 
    });

    describe('POST /login', () => {
        it('should log in a user successfully', (done) => {
            chai.request(server)
                .post('/login')
                .send({ email: 'login@example.com', password: 'Password1!' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('success', true);
                    expect(res.body).to.have.property('message', 'Logged in successfully! Redirecting...');
                    done();
                });
        });

        it('should return error for invalid email', (done) => {
            chai.request(server)
                .post('/login')
                .send({ email: 'invalid@example.com', password: 'Password1!' })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('success', false);
                    expect(res.body).to.have.property('message', 'Invalid email or password');
                    done();
                });
        });

        it('should return error for invalid password', (done) => {
            chai.request(server)
                .post('/login')
                .send({ email: 'login@example.com', password: 'WrongPassword' })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('success', false);
                    expect(res.body).to.have.property('message', 'Invalid email or password');
                    done();
                });
        });
    });
});
