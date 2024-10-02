# Freelance Fusion

## Introduction
FreelanceFusion is a platform where freelancers can create profiles and
connect with clients seeking various services. It facilitates direct
communication, helping freelancers and clients establish effective
connections.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Testing](#testing)
- [Contribution](#contribution)

## Features
This software project includes following features:
- **User authentication**: Register and login
- **Profile management**: View and update profile
- **Search function**: Search job, search freelancer
- **Job board**:
    - Client:
        - Post new job to job board
        - Edit posted jobs
        - View all posted jobs
    - Freelancer:
        - Apply for a job
- **Project Management**: 
    - Manage your project with tasks can boards (To-do, In progress and Completed)
    - Client:
        - Accept application from freelancer
        - Remove freelancer from current project
- **Real-time communication**: Real-time chat between freelancer and client
- **Ratings and reviews**
    - Client: 
        - View your given ratings and reviews
        - Add your new ratings and reviews
        - Delete your ratings and reviews
    - Freelacner:
        - View your received ratings

[Back to top](#introduction)

## Installation
1. Clone the repository

    ```
    git clone https://github.com/TUT888/FreelanceFusion.git
    ```

2. Go to project folder

    ```
    cd FreelanceFusion
    ```

2. Install dependencies
    ```
    npm install
    ```

3. Set environment variables

    - Create `.env` file in the root directory
    - Set the following environment variables:
        ```
        MONGODB_URL=<URL to your MongoDB>
        SESSION_SECRET=<Your secret key>
        ```

4. Run the project
    - Run during development
        ```
        npm run start:dev
        ```
    - Normal run
        ```
        npm start
        ```

[Back to top](#introduction)

## Testing

Unit test: use following command to run the test with Mocha and Chai:
```
npm test
```
    
[Back to top](#introduction)

## Contribution
Our team members:
- Alice Tat: responsible for Profile Management, Ratings and Reviews features
- Tuan Phong Nguyen: responsible for Job/Freelancer Search, Project Management features
- Caroline Nguyen: responsible for UI of homepage, login, register (frontend)
- Sumedh Vartak: responsible for user authentication (backend) and real-time communication
- Misa Aghera: responsible for job post management and real-time communication