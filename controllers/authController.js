const bcrypt = require('bcrypt');
const saltRounds = 10;
const client = require('../dbConnection');
const usersCollection = client.db().collection('users');
const authCollection = client.db().collection('auths');
const session = require('express-session');



const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // check if user already exists
        const user = await authCollection.findOne({ email });
        if (user) {
            return res.status(400).send('User already exists');
        }

      
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await authCollection.insertOne({
            email,
            username,
            password: hashedPassword,
            created_at: new Date(),
            updated_at: new Date()
        });




        // await usersCollection.insertOne({
        //     user_id: result.insertedId, 
        //     email,
        //     role: 'freelancer', 
        //     profile: {},
        //     name: username,
        //     skills: [],
        //     experience: '',
        //     company_details: '',
        //     contact_info: { phone: '', address: '' },
        //     created_at: new Date(),
        //     updated_at: new Date()
        // });

        res.status(201).send('User registered successfully');
        res.redirect('/sign-in');
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Internal Server Error');
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find the user in the 'auth' collection
        const user = await authCollection.findOne({ email });
        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

  
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Invalid email or password');
        }

        // store user information in session
        req.session.user = {
            id: user._id,
            email: user.email,
            profile: user.profile
        };

        res.redirect('/profile');
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).send('Internal Server Error');
    }
};


const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/');
    });
};

module.exports = {
    register,
    login,
    logout
};
