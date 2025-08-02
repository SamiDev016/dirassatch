import Header from "../components/Header"
import Footer from "../components/Footer"

const About = () => {
  return (
    <div>
      <Header />
      <div className="px-6 md:px-20 py-10">
        <h1 className="text-2xl font-bold text-center mb-6">About Our Platform</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Welcome to our Academy Management Platform — an all-in-one solution designed to modernize and simplify the educational experience for academies, teachers, parents, and students.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">For Academies</h2>
            <p className="text-gray-700">
              Manage your entire educational system with ease — control courses, teachers, students, and monitor progress in real time.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">For Teachers</h2>
            <p className="text-gray-700">
              Create and manage courses, track student performance, and communicate directly with both students and parents.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">For Parents</h2>
            <p className="text-gray-700">
              Stay involved in your child's education. Track attendance, performance, receive updates, and connect with teachers.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">For Students</h2>
            <p className="text-gray-700">
              Access online courses, receive feedback from teachers, and stay engaged in a smart learning environment.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Course Management</h2>
            <p className="text-gray-700">
              Organize classes, set schedules, assign teachers, and monitor student enrollment and progress.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Communication & Messaging</h2>
            <p className="text-gray-700">
              Built-in messaging system to connect parents, students, and teachers instantly and securely.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default About
