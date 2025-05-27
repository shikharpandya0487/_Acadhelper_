import { useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import {ReactTyped} from 'react-typed'

// Example images (replace with your own or use Cloudinary links)
const heroImage = "https://images.pexels.com/photos/4145197/pexels-photo-4145197.jpeg"
const featureImages = [
  "https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg",
  "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
  "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg"
]

const features = [
  {
    title: "User Management",
    description: "Register, log in, and manage user profiles with unique roles (admin, student).",
    img: featureImages[0]
  },
  {
    title: "Course & Assignment Tracking",
    description: "Add, update, and track courses and assignments with due dates, status, and points.",
    img: featureImages[1]
  },
  {
    title: "Group Collaboration",
    description: "Shared task management, invite members, and submit challenges as a team.",
    img: featureImages[2]
  },
  // Add more features as needed
]

const Home = () => {

  useEffect(() => {
    document.title = "AcadHelper – Your Academic Companion"
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-24 py-12 pt-28">
        <div className="flex-1">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            <ReactTyped
              strings={[
                "AcadHelper",
                "Your Academic Companion",
                "Organize. Collaborate. Succeed."
              ]}
              typeSpeed={80}
              backSpeed={40}
              backDelay={1200}
              loop
              showCursor
              cursorChar="|"
            />
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Streamline your academic journey with powerful tools for managing courses, assignments, events, and collaboration—all in one place.
          </p>
          <div
            className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Get Started
          </div>
        </div>
        <div className="flex-1 flex justify-center mb-8 md:mb-0">
          <img
            src={heroImage}
            alt="Academic Collaboration"
            className="rounded-xl shadow-xl w-full max-w-md object-cover"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8 px-8 md:px-24">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-indigo-50 rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition">
              <img src={feature.img} alt={feature.title} className="w-24 h-24 object-cover rounded-full mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gamification & Leaderboard */}
      <div className="py-16 px-8 md:px-24 flex flex-col md:flex-row items-center bg-gradient-to-r from-indigo-100 to-blue-50">
        <div className="flex-1 mb-8 md:mb-0">
          <h3 className="text-2xl font-bold mb-2">Gamification & Leaderboards</h3>
          <p className="text-gray-700 mb-4">
            Earn points for daily and weekly challenges, early submissions, and climb the leaderboard to see how you stack up against others—both in your course and globally!
          </p>
          {/* You can add a Lottie animation here for gamification */}
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg"
            alt="Leaderboard"
            className="rounded-xl shadow-xl w-full max-w-xs object-cover"
          />
        </div>
      </div>

      {/* Virtual Room & Pomodoro */}
      <div className="py-16 px-8 md:px-24 flex flex-col md:flex-row-reverse items-center bg-white">
        <div className="flex-1 mb-8 md:mb-0">
          <h3 className="text-2xl font-bold mb-2">Virtual Room & Pomodoro Timer</h3>
          <p className="text-gray-700 mb-4">
            Stay focused with a distraction-free virtual room and built-in Pomodoro timer to maximize your productivity.
          </p>
          {/* Add Lottie or animated SVG for Pomodoro here */}
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg"
            alt="Pomodoro Timer"
            className="rounded-xl shadow-xl w-full max-w-xs object-cover"
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Ready to boost your academic performance?</h2>
      </div>
    </div>
  )
}

export default Home
