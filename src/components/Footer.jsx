import { useNavigate } from "react-router-dom"

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-gradient-to-tr from-blue-50 via-white to-blue-100 border-t border-blue-200 shadow-inner pt-10 pb-4 px-4 md:px-10 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">DirassaTech</h2>
          <p className="text-gray-600 mb-4 text-sm">DirassaTech is your gateway to online learning, providing quality courses and resources for students, teachers, and academies worldwide.</p>
          <form className="flex flex-col gap-2">
            <label htmlFor="newsletter" className="font-semibold text-gray-700 text-sm">Subscribe to our newsletter</label>
            <div className="flex">
              <input id="newsletter" type="email" placeholder="Your email address" className="p-2 rounded-l border border-gray-300 focus:outline-none focus:border-blue-500 bg-white w-full" />
              <button type="submit" className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600 transition">Subscribe</button>
            </div>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-blue-700 mb-3">Quick Links</h3>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li><a href="#" onClick={() => navigate("/")} className="hover:text-blue-500 transition">Home</a></li>
            <li><a href="#" onClick={() => navigate("/courses")} className="hover:text-blue-500 transition">Courses</a></li>
            <li><a href="#" onClick={() => navigate("/academies")} className="hover:text-blue-500 transition">Academies</a></li>
            <li><a href="#" onClick={() => navigate("/about")} className="hover:text-blue-500 transition">About Us</a></li>
            <li><a href="#" onClick={() => navigate("/contact")} className="hover:text-blue-500 transition">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-blue-700 mb-3">Get in Touch</h3>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li><span className="font-bold">Phone:</span> 0782 68 46 01</li>
            <li><span className="font-bold">Email:</span> info@dirassatech.com</li>
            <li><span className="font-bold">Location:</span> Bachjarah, Algiers, Algeria</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-blue-700 mb-3">Follow Us</h3>
          <div className="flex space-x-4 mb-3">
            <a href="#" onClick={() => navigate("/")} className="text-blue-600 hover:text-blue-800 text-xl" title="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" onClick={() => navigate("/")} className="text-blue-400 hover:text-blue-600 text-xl" title="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" onClick={() => navigate("/")} className="text-pink-600 hover:text-pink-800 text-xl" title="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" onClick={() => navigate("/")} className="text-blue-700 hover:text-blue-900 text-xl" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <p className="text-gray-500 text-xs">Stay connected with us on social media for updates and news.</p>
        </div>
      </div>
      <div className="border-t border-blue-100 mt-8 pt-4 text-center">
        <p className="text-gray-600 text-base font-medium tracking-wide">Copyright 2025 <span className="font-bold text-blue-700">DirassaTech</span>. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer