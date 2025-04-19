AcadHelper is a comprehensive academic assistance platform built using Next.js, designed to streamline educational management and enhance the learning experience. The platform offers a variety of features including course management, assignment tracking, and user submissions, making it a valuable tool for both educators and students.


## Team Members
- [Shikhar Pandya](https://github.com/shikharpandya0487)
- [Ravula Hannsika](https://github.com/Hannsika5)

---
## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Pictures](#Project_Pictures)


## Features

- **User Management**: Register, log in, and manage user profiles with unique roles (admin, student).
- **Course Management**: Add, update, and track courses.
- **Assignment Tracking**: Manage assignments with details like due dates, submission status, and points.
- **Submission Handling**: Submit assignments and challenges with status tracking.
- **Event planning**: A built-in event scheduling feature to help users plan and organize academic events effectively, ensuring no important dates are missed.
- **Notification System**: Receive inbox messages for group invitations.
- **Email Verification**: Ensures that users verify their email addresses for account validation and security.
- **Admin Panel**: Dedicated interface for managing courses, users, and study materials.
- **Cloud Management** : Integration with Cloudinary for media storage and management.
- **Group Collaboration** : Includes shared task management, addition of members through invite requests, and submission to challenges as a team 
- **Gamification**: Earn points through daily and weekly challenges, and early submissions to assignments
- **Leaderboard** : Compare your position among other learners in a course, as well as globally
- **Virtual Room** : Allows the user to use Pomodoro Timer for himself without any distractions.

## Tech Stack

- **Framework**: Next.js: Utilized for both the frontend and backend logic, leveraging API routes to handle server-side operations.
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS, Material-UI (MUI)
- **Authentication**: JWT-based user authentication
- **Version Control**: Git and GitHub
- **APIs**: RESTful API architecture

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/acadhelper.git
   cd acadhelper
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and configure the following environment variables:
   ```plaintext
        MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>

        TOKEN_SECRET="your_jwt_secret_key"

        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
        NEXT_PUBLIC_CLOUDINARY_API_KEY="your_cloudinary_api_key"
        CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action.




## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add a new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## Project_Pictures
![WhatsApp Image 2024-11-10 at 09 42 18](https://github.com/user-attachments/assets/12eccf82-84a2-471a-baf7-dc5a9a112ebb)

![WhatsApp Image 2024-11-10 at 09 42 18 (1)](https://github.com/user-attachments/assets/6bf8b897-b12a-4559-8097-bff93d5dca96)

![WhatsApp Image 2024-11-10 at 09 42 18 (2)](https://github.com/user-attachments/assets/4e47d1a9-ab22-4c61-856c-d24b7d86cb1c)

![WhatsApp Image 2024-11-10 at 09 42 18 (3)](https://github.com/user-attachments/assets/bb34fae8-4cb2-4561-a6b2-0d5d2be2ad0d)

![WhatsApp Image 2024-11-10 at 09 42 18 (4)](https://github.com/user-attachments/assets/141fc0d6-92d7-485c-a430-23e91ffbc1e9)

![WhatsApp Image 2024-11-10 at 09 42 18 (5)](https://github.com/user-attachments/assets/ca7e7830-b89b-4bdf-99f0-fb5a56e7c87f)

![WhatsApp Image 2024-11-10 at 09 42 18 (6)](https://github.com/user-attachments/assets/6bf03a34-b445-4177-b230-959f183941cd)

![WhatsApp Image 2024-11-10 at 09 42 18 (7)](https://github.com/user-attachments/assets/55077258-1acc-4344-bbc5-0e83c7cfddfe)

![WhatsApp Image 2024-11-10 at 09 42 18 (8)](https://github.com/user-attachments/assets/bf70d14d-ec83-4153-9ccb-30bd470178de)

![WhatsApp Image 2024-11-10 at 09 42 18 (9)](https://github.com/user-attachments/assets/48c82f02-4c0c-4b08-8820-756425a81440)

![WhatsApp Image 2024-11-10 at 09 42 18 (10)](https://github.com/user-attachments/assets/e97bd313-e9bf-4d20-85e9-5bb805d3d429)

![WhatsApp Image 2024-11-10 at 09 42 18 (11)](https://github.com/user-attachments/assets/8093003e-bab6-4574-a67b-83641e235094)

![WhatsApp Image 2024-11-10 at 09 42 18 (12)](https://github.com/user-attachments/assets/0ae6004b-d884-4734-b873-dfc78e58af87)

![WhatsApp Image 2024-11-10 at 09 42 18 (13)](https://github.com/user-attachments/assets/d25cd745-b201-4103-87eb-be07510b54cc)

![WhatsApp Image 2024-11-10 at 09 43 04](https://github.com/user-attachments/assets/e42d3d29-4607-48ee-9136-da70ff4f1589)

![WhatsApp Image 2024-11-10 at 09 44 42](https://github.com/user-attachments/assets/8a4e9d39-df1e-43d5-a71d-2f1f4eb54bea)

![WhatsApp Image 2024-11-10 at 09 44 42 (1)](https://github.com/user-attachments/assets/6fa9381b-29ee-447c-abae-200879230b0e)

![WhatsApp Image 2024-11-10 at 09 44 42 (2)](https://github.com/user-attachments/assets/0e13ed54-3ad9-4edd-80fa-e0cf05b180c4)

![WhatsApp Image 2024-11-10 at 09 44 02](https://github.com/user-attachments/assets/058c6aea-d202-4f89-ae0c-7452effaa2fd)

![WhatsApp Image 2024-11-10 at 09 44 21](https://github.com/user-attachments/assets/efb40f37-258f-4ca8-8efe-2e42be0889c2)
