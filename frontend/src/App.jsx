import { BrowserRouter, Routes, Route } from "react-router-dom";
import Groups from './pages/Groups';
import Notification from './pages/Notification';
import Profile from './pages/Profile/Profile.jsx'
import AdminPage from './pages/admin/Courses/AdminPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Focus from './pages/Focus.jsx'
import Schedule from './pages/Schedule.jsx'
import UploadChallenge from './pages/admin/uploadchallenge/UploadChallenge.jsx'
import SubmissionDetails from './pages/Submission/SubmissionDetails.jsx'
import Courses from './pages/Courses.jsx'
import AssignmnetDetailsAdmin from './pages/Assignment/admin/AssignmnetDetailsAdmin.jsx'
import AssignmentDeatilsUser from './pages/Assignment/user/AssignmentDetailsUser.jsx'
// import ChallengeDetails from './pages/Challenge/user/ChallengeDetailsUser.jsx'
import ChallengeDetailsUser from './pages/Challenge/user/ChallengeDetailsUser.jsx';
import ChallengeDetails2 from './pages/Challenge/ChallengeDetails2.jsx';
import AdminPageCourse from './pages/user/Courses/AdminPageCourse.jsx';
import GroupPage from './pages/Group/GroupPage.jsx';
import DailyChallenges from './pages/Challenge/DailyChallenges.jsx'
import Home from "./pages/Home.jsx";


function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/Dashboard" element={<Dashboard/>}/>
          <Route path="/Courses" element={<Courses/>}/>
          <Route path="/Groups" element={<Groups/>}/>
          <Route path="/Leaderboard" element={<Leaderboard/>}/>
          <Route path="/Schedule" element={<Schedule/>}/>
          <Route path="/Notification" element={<Notification/>}/>
          <Route path="/Focus" element={<Focus/>}/>
          <Route path="/Profile/:id" element={<Profile/>}/>
          <Route path="/user/Courses/:id" element={<AdminPageCourse/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/:groupId/GroupPage" element={<GroupPage/>}/>
          <Route path="/admin/Courses/:id" element={<AdminPage/>}/>
          <Route path="/admin/uploadchallenge/:id" element={<UploadChallenge/>}/>
          <Route path="/Assignment/admin/:id" element={<AssignmnetDetailsAdmin/>}/>
          <Route path="/Assignment/user/:id" element={<AssignmentDeatilsUser/>}/>
          <Route path="/Challenge/user/:id" element={<ChallengeDetailsUser/>}/>
          <Route path="/Challenge/:id" element={<ChallengeDetails2/>}/>
          <Route path="/Challenge/DailyChallenges" element={<DailyChallenges/>}/>
          <Route path="/Submission/:id" element={<SubmissionDetails/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
