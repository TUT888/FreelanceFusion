const mongoose = require('mongoose');
const { Schema } = mongoose;

// define the schema for users collection

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['freelancer', 'client'], required: true },
  profile: {
    name: { type: String, required: true },
    skills: [String], // only applicable for freelancers
    experience: String, // only applicable for freelancers
    company_details: String // only applicable for clients
  },
  contact_info: {
    phone: String,
    address: String
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// define the schema for auth collection
const authSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// define the schema for jobs collection
const jobSchema = new Schema({
  client_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  status: { type: String, enum: ['open', 'in_progress', 'completed', 'closed'], default: 'open' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// define the schema for projects collection
const projectSchema = new Schema({
  client_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  job_id: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  progress: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// define the schema for messages collection
const messageSchema = new Schema({
  sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// define the schema for ratings collection
const ratingSchema = new Schema({
  project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  rater_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ratee_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: String,
  timestamp: { type: Date, default: Date.now }
});

// create models
const User = mongoose.model('User', userSchema);
const Auth = mongoose.model('Auth', authSchema);
const Job = mongoose.model('Job', jobSchema);
const Project = mongoose.model('Project', projectSchema);
const Message = mongoose.model('Message', messageSchema);
const Rating = mongoose.model('Rating', ratingSchema);

module.exports = { User, Auth, Job, Project, Message, Rating };
