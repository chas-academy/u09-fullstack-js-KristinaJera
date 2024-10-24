# Job-Seeking Application

This is a full-stack web application that connects job seekers with companies. The application provides different functionalities for three types of users: job seekers, companies, and admins. Each user type has access to unique features based on their role, ensuring a tailored experience.

## Table of Contents
1. [Features](#features)
2. [User Roles](#user-roles)
3. [JWT Authentication & Security](#jwt-authentication--security)
4. [Progressive Web App (PWA)](#progressive-web-app-pwa)
5. [File Uploads](#file-uploads)
6. [Testing & Deployment](#testing--deployment)
7. [Frontend Improvements](#frontend-improvements)
8. [Design Process](#design-process)
   - [Personas and User Stories](#personas-and-user-stories)
   - [Low-fi Prototypes and Sitemap](#low-fi-prototypes-and-sitemap)
9. [Tech Stack](#tech-stack)
10. [Installation and Setup](#installation-and-setup)
11. [API Documentation](#api-documentation)
12. [Contributing](#contributing)
13. [License](#license)

## Features

### User Roles
The application supports three distinct user roles:

- **Job Seeker**: Can search for jobs, apply for jobs, view the status of their applications, manage their profile, and send/receive messages through the contact form to admin.
- **Company**: Can post job listings, perform CRUD operations on them, manage their profile, view/manage applications submitted to their job postings, and send/receive messages through the contact form to admin.
- **Admin**: Has full CRUD capabilities for all users, companies, and other admins. Admin can also view reports and statistics, and manage messages between users and the system.

Each user type has access to their own dashboard, customized based on their role.

### JWT Authentication & Security
- JWT-based authentication is implemented to ensure secure access to protected routes.
- Role-based access control is applied:
  - Admins have CRUD access to all user and company data.
  - Companies can only manage their own job postings, profile information, job applications, and their own messages.
  - Job seekers can only access their own applications, profile information, their own messages, and search/filter jobs.
- Secure password storage with hashing, and HTTPS is enforced for sensitive data transmissions.
- Tokens are securely handled and have expiration dates to enhance security. Refresh tokens can be added for longer sessions if needed.

### Progressive Web App (PWA)
- The application is a fully functional Progressive Web App (PWA).
- It supports offline capabilities with caching via service workers for static assets (HTML, CSS, JS) and critical API responses (job listings, user profiles).
- Users can install the app on their devices, adding it to the home screen for a native app-like experience.

### File Uploads
- Users (job seekers) can securely upload their resumes as part of the job application process, and also upload images for their profile.
- Users (companies) can securely view/download applicants' resumes and upload images for their profile.
- Uploaded files are securely stored on the server and are only accessible to the companies reviewing the applications.

### Testing & Deployment
- The application has been tested thoroughly across multiple browsers (Chrome, Firefox, Safari) to ensure compatibility.
- It is deployed using Render (Backend) and Netlify (Frontend) and is accessible via the following link: **[Job Seeking App](https://jseekingappp.netlify.app)**.
- Unit tests have been implemented for key features like authentication, job searching, and user role management.
- Integration tests are in place for API functionality, ensuring seamless communication between the frontend and backend.

### Frontend Improvements
- The frontend is fully responsive, ensuring a smooth user experience across devices (mobile, tablet, desktop).
- Accessibility features such as keyboard navigation, proper color contrast, and semantic HTML are used.
- User experience improvements include smooth transitions, form validation, and user-friendly notifications.

## Design Process

### Personas and User Stories
We followed a user-centered design process, conducting user research to develop the following:

- **Personas**: [View Personas](https://www.figma.com/design/mwpb63Zmknj64vBg4lem3E/Jobseeking-App-User-Stories-%26-Personas?t=X9hmjy37C9G6b8qB-1)
- **User Stories**: [View User Stories](https://www.figma.com/design/mwpb63Zmknj64vBg4lem3E/Jobseeking-App-User-Stories-%26-Personas?t=X9hmjy37C9G6b8qB-1)

These were used to inform the design and functionality of the app, ensuring that it meets the needs of job seekers, companies, and admins.

### Low-fi Prototypes and Sitemap
During the design phase, low-fidelity prototypes and sitemaps were created to map out the user flow and structure of the application.

- **Low-fi Prototype**: [View Low-fi Prototype](https://www.figma.com/design/GtFjwhB6dBKHNPbVeTFyy1/Job-Seeking-App?node-id=0-1&t=X9hmjy37C9G6b8qB-1)
- **Sitemap**: [View Sitemap](https://www.figma.com/design/ngvk6GnURA8ASFvs290MVt/sitemap-Jobseeking-app?node-id=0-1&t=olNKUcHIyXrFLexL-1)

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB (NoSQL)
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment**: Render (Backend) and Netlify (Frontend)
- **Version Control**: Git, GitHub
- **PWA**: Service Workers, Cache API, Web App Manifest
- **Testing**: Jest, Insomnia/Postman for API testing

## API Documentation
The backend provides a fully RESTful API that handles user authentication, job posting, job applications, and CRUD operations for users, companies, and admins.

Here are some examples of API routes:

- **POST /api/auth/register**: Registers a new user or company.
- **POST /api/auth/login**: Logs in a user, company, or admin and returns a JWT token.
- **GET /api/jobs**: Returns a list of available jobs (can be filtered by various criteria).
- **POST /api/jobs/apply/:jobId**: Allows a user to apply for a job by providing a job ID.

### Other API Features:

- **User CRUD Operations**: 
  - Admins have full access to manage users, companies, and admins (Create, Read, Update, Delete) and can communicate via messages with users and companies.
  - Users can update their profiles, upload profile images, apply to job posts, view their application statuses, search/filter jobs, and contact admin via the contact us form.
  - Companies can update their profiles, upload profile images, perform CRUD operations on job posts, view applications, change their status, and contact admin via the contact us form.
  
- **Job Postings**: 
  - Companies can manage their job postings (Create, Read, Update, Delete).
  - Admins can view and manage users, companies, and admins.

- **Application Tracking**: 
  - Job seekers can track the status of their applications (Pending, Accepted, Rejected).
  - Companies can review and update the status of applications they received and view/download resumes.

- **Messaging**: 
  - Users can send messages to admins through the "Contact Us" feature.
  - Companies can send messages to admins through the "Contact Us" feature.
  - Admins can view and respond to messages from both job seekers and companies.

- **Statistics Overview**: 
  - Admins can view statistics related to users, job postings, and applications for reporting purposes.

- **Role Management**: 
  - Admins can manage user roles, ensuring appropriate access to various features of the application.

- **File Uploads**: 
  - Users can securely upload documents (like resumes) when applying for jobs and upload profile images.
  - Companies can view/download the documents (like resumes) and upload profile images.

## Installation and Setup
To run this project locally, follow these steps:

### Clone the repository:
```bash
git clone https://github.com/chas-academy/u09-fullstack-js-KristinaJera

Backend:
cd backend
npm run dev 

Frontend
cd frontend/jobseeking
npm run dev 
Access the application at: http://localhost:5173/
