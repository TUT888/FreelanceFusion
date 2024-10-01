const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); 
const expect = chai.expect;
const client = require('../dbConnection');

chai.use(chaiHttp);


const clearCollections = async () => {
    const authCollection = client.db().collection('auths');
    const usersCollection = client.db().collection('users');
    
    await authCollection.deleteMany({ email: 'test@example.com' });
    await usersCollection.deleteMany({ email: 'test@example.com' });
    await authCollection.deleteMany({ email: 'duplicate@example.com' });
    await usersCollection.deleteMany({ email: 'duplicate@example.com' });
};


describe('User Registration', () => {

    before(async () => {
        await clearCollections();
    });
    
    describe('POST /register', () => {

        
        it('should register a user successfully', (done) => {
            chai.request(server)
                .post('/register')
                .send({ email: 'test@example.com', password: 'Password1!', username: 'testuser' })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('success', true);
                    expect(res.body).to.have.property('message', 'User registered successfully! Redirecting...');
                    done();
                });

                after(async () => {
                    await chai.request(server).post('/logout'); 
                });
        });

        it('should return error for existing email', (done) => {
            chai.request(server)
                .post('/register')
                .send({ email: 'test@example.com', password: 'Password1!', username: 'newuser' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('success', false);
                    expect(res.body).to.have.property('message', 'Email already in use! Please use a different email');
                    done();
                });
        });

        it('should return error for existing username', (done) => {
            chai.request(server)
                .post('/register')
                .send({ email: 'new@example.com', password: 'Password1!', username: 'testuser' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('success', false);
                    expect(res.body).to.have.property('message', 'Username already in use! Please use a different username');
                    done();
                });
        });

        it('should return error for empty username', (done) => {
            chai.request(server)
                .post('/register')
                .send({ email: 'empty@example.com', password: 'Password1!', username: ' ' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('success', false);
                    expect(res.body).to.have.property('message', 'Username cannot be empty.');
                    done();
                });
        });

        it('should return error for weak password', (done) => {
            chai.request(server)
                .post('/register')
                .send({ email: 'weak@example.com', password: 'weak', username: 'weakuser' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('success', false);
                    expect(res.body).to.have.property('message', 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
                    done();
                });
        });

        it('should not allow duplicate registrations', async () => {
            await chai.request(server)
                .post('/register')
                .send({ email: 'duplicate@example.com', password: 'Password1!', username: 'duplicateuser' });

            const res = await chai.request(server)
                .post('/register')
                .send({ email: 'duplicate@example.com', password: 'Password1!', username: 'duplicateuser' });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('success', false);
            expect(res.body).to.have.property('message', 'Email already in use! Please use a different email');
        });
    });
});
