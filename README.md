AcadHelper is a comprehensive **academic assistance platform** built using MERN, designed to streamline educational management and enhance the learning experience. The platform offers a variety of features including course management, assignment tracking, and user submissions, making it a valuable tool for both educators and students.


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
<img width="1914" height="961" alt="image" src="https://github.com/user-attachments/assets/18b0b237-b680-415b-b67f-753895c953c0" />
<img width="1096" height="932" alt="image" src="https://github.com/user-attachments/assets/a6b21279-f56a-4cfa-8fbe-a4a3b472122d" />
<img width="1911" height="966" alt="image" src="https://github.com/user-attachments/assets/a91cd3f3-e844-41c4-b9c9-9a15333d33e8" />
<img width="1914" height="942" alt="image" src="https://github.com/user-attachments/assets/39cb997b-fa43-45f6-bf89-2c0b7d81df6a" />
<img width="1909" height="765" alt="image" src="https://github.com/user-attachments/assets/d99c73d5-ea0e-4b2a-902f-78d9196f210e" />
<img width="1909" height="718" alt="image" src="https://github.com/user-attachments/assets/7b5faa3a-3a3a-4a07-a479-dcdad9727053" />
<img width="1913" height="952" alt="image" src="https://github.com/user-attachments/assets/a718ede5-e126-463e-b023-359bba2062c9" />
<img width="1631" height="764" alt="image" src="https://github.com/user-attachments/assets/60693ebf-ab4f-4897-8477-0dceeefd1daf" />
<img width="1436" height="358" alt="image" src="https://github.com/user-attachments/assets/69a027b5-097b-4130-b8ea-a8ea511e0362" />
<img width="1231" height="522" alt="image" src="https://github.com/user-attachments/assets/23b7c61b-8007-4cc7-8a13-9e4e6d3bf368" />
<img width="1900" height="862" alt="image" src="https://github.com/user-attachments/assets/4e12d795-b082-49ae-a21e-e5fb3704eb45" />
<img width="1919" height="956" alt="image" src="https://github.com/user-attachments/assets/08c1544c-107c-43e9-af75-5bc607c201b7" />
<img width="1152" height="863" alt="image" src="https://github.com/user-attachments/assets/60e177c2-8a82-4c83-9659-2a51a638ed38" />
<img width="1145" height="882" alt="image" src="https://github.com/user-attachments/assets/2b1a57a8-cc77-4682-a5fb-0fd0a37f51ab" />
<img width="506" height="389" alt="image" src="https://github.com/user-attachments/assets/0e8a54c0-4a60-492e-8f41-c2ba6a747631" />
<img width="1571" height="879" alt="image" src="https://github.com/user-attachments/assets/5c681e4a-f37f-48ad-aa9a-dbfcd7146ff6" />



