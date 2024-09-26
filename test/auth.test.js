const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); 
const expect = chai.expect;

chai.use(chaiHttp);

describe('User Authentication', () => {
    
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
        });

        it('should return error for existing email', (done) => {
            chai.request(server)
                .post('/register')
                .send({ email: 'test@example.com', password: 'Password1!', username: 'newuser' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('success', false);
                    expect(res.body).to.have.property('message', 'Email  already in use! Please use a different email');
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
                    expect(res.body).to.have.property('message', 'Username  already in use! Please use a different username');
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


        it('should not allow duplicate registrations', async () => {
            await chai.request(server)
                .post('/register')
                .send({ email: 'duplicate@example.com', password: 'Password1!', username: 'duplicateuser' });

            const res = await chai.request(server)
                .post('/register')
                .send({ email: 'duplicate@example.com', password: 'Password1!', username: 'duplicateuser' });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('success', false);
            expect(res.body).to.have.property('message', 'email already in use');
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


    describe('POST /login', () => {
        before(async () => {
            // Register a user before login tests
            await chai.request(server)
                .post('/register')
                .send({ email: 'login@example.com', password: 'Password1!', username: 'loginuser' });
        });

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
