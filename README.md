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
    - [Unit test](#1-unit-test)
    - [End-to-end test](#2-end-to-end-test)
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
    - Manage your project with tasks can boards (To-do, In progress and Completed). This feature is real-time sync between client and freelancer.
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
    - Real-time notification is sent to target freelancer immediately when a new rating is added for them

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

**IMPORTANT NOTE: before running any type of testing, make sure you have your website running**

### 1. Unit test
Use following command to run all the test with Mocha and Chai:
```
npm test
```

### 2. End-to-end test
To run the end-to-end test, choose one of the following options:
- Test with Cypress interface open:
    - Run the following command to launch the browser:
        ```
        npm run e2e:open
        ```
    - In the welcome page, choose E2E testing
    - Choose a browser and click "Start E2E Testing"
    - Click on any `.cy.js` file to start the testing with this them. For example, click on the `home.cy.js` to start testing the features in homepage.
- Test with command line:
    - Run all tests with the following command:
        ```
        npm run e2e:chrome
        ```
    - Observe the testing result in command line
    
    
[Back to top](#introduction)

## Contribution
Our team members:
- **Alice Tat**: responsible for profile management, ratings and reviews features (HI-FI prototype, feature implementation, unit testing, end-to-end testing).
- **Tuan Phong Nguyen**: responsible for job/freelancer search, project management features (HI-FI prototype, feature implementation, unit testing, end-to-end testing).
- **Caroline Nguyen**: responsible for UI of homepage, login, register (frontend implementation).
- **Sumedh Vartak**: responsible for database (implementation and backup), user authentication (backend) and real-time communication features.
- **Misa Aghera**: responsible for database design, job post management and real-time communication features.