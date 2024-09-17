const bcrypt = require('bcrypt');
const saltRounds = 10;
const client = require('../dbConnection');
const usersCollection = client.db().collection('users');
const authCollection = client.db().collection('auths');
const session = require('express-session');



const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        console.log("Received registration data:", { email, password, username });


        // check if user already exists
        const user = await authCollection.findOne({ email });

        console.log("Existing user check:", user);

        if (user){

            console.log("first if");

        if (user.email==email) {
            console.log("second if");
            return res.status(400).json({ success: false, message: 'email  already in use' });
        }

        if (user.username==username) {
            console.log("thrid if");
            return res.status(400).json({ success: false, message: 'username  already in use' });
        }

    }

        
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await authCollection.insertOne({
            email,
            username,
            password: hashedPassword,
            created_at: new Date(),
            updated_at: new Date()
        });

        const userId = result.insertedId;

        await usersCollection.insertOne({
            _id: userId, 
            email,
            password: hashedPassword,
            role: 'freelancer', 
            profile: {
                name: username,
                skills: [], // Default to empty array
                experience: '' // Default to empty string
            },
            contact_info: {
                phone: '', // Default to empty string
                address: '' // Default to empty string
            },
            created_at: new Date(),
            updated_at: new Date()
        });


   
          

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await authCollection.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        req.session.user = {
            // id: user._id,
            email: user.email,
            role: user.role
            // profile: user.profile
        };

        res.json({ success: true, message: 'Logged in successfully' });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
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
