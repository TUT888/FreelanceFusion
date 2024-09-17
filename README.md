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
- **Job board**: Post new job

[Back to top](#introduction)

## Installation
1. Clone the repository

    ```
    git clone https://github.com/TUT888/FreelanceFusion.git
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

1. Unit test: use following command to run the test with Mocha and Chai:
    ```
    npm test
    ```
    
[Back to top](#introduction)

## Contribution
Our team members:
- Alice Tat
- Tuan Phong Nguyen
- Caroline Nguyen
- Sumedh Vartak
- Misa Aghera