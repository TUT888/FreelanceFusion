const mongoose = require('mongoose');
const { User, Auth, Job, Project, Message, Rating } = require('../models/dbSetup');

// replace below string with the db url if you want to have your own db
const uri = 'mongodb+srv://s223654321:H7uDcmOy0UTjPVAl@cluster0.opevcdh.mongodb.net/freelancefusion_dev';

async function seedDatabase() {
  try {
    // connect to MongoDB
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');



    // insert dummy data

    // create users
    const user1 = await User.create({
      email: 'freelancer@example.com',
      password: 'hashed_password_1',
      role: 'freelancer',
      profile: {
        name: 'Alice Smith',
        skills: ['JavaScript', 'React'],
        experience: '4 years of experience in front-end development'
      },
      contact_info: {
        phone: '123-456-7890',
        address: '123 Freelance St, Developer City'
      }
    });

    const user2 = await User.create({
      email: 'client@example.com',
      password: 'hashed_password_2',
      role: 'client',
      profile: {
        name: 'Bob Johnson',
        company_details: 'TechCorp, Inc.'
      },
      contact_info: {
        phone: '987-654-3210',
        address: '456 Tech Blvd, Innovator Town'
      }
    });

    // create auth records
    await Auth.create({
      user_id: user1._id,
      username: 'alice',
      password: 'hashed_password_1'
    });

    await Auth.create({
      user_id: user2._id,
      username: 'bob',
      password: 'hashed_password_2'
    });

    // create jobs
    const job1 = await Job.create({
      client_id: user2._id,
      title: 'Build a React Application',
      description: 'Need a skilled React developer to build a web application.',
      requirements: ['React', 'Node.js'],
      status: 'open'
    });

    // create projects
    const project1 = await Project.create({
      client_id: user2._id,
      freelancer_id: user1._id,
      job_id: job1._id,
      status: 'not_started',
      progress: 'Initial planning'
    });

    // create messages
    await Message.create({
      sender_id: user1._id,
      receiver_id: user2._id,
      project_id: project1._id,
      content: 'Hi Bob, I’m interested in your project.',
      timestamp: new Date()
    });

    // create ratings
    await Rating.create({
      project_id: project1._id,
      rater_id: user2._id,
      ratee_id: user1._id,
      rating: 5,
      review: 'Excellent work!',
      timestamp: new Date()
    });

    console.log('Database seeded with dummy data');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
