import { useNavigate } from "react-router-dom"
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Linkedin, Globe, BookOpen, Users, Award } from "lucide-react"

const Footer = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert("Thank you for subscribing to our newsletter!");
  };
  
  return (
    <footer className="bg-gradient-to-tr from-blue-50 via-white to-blue-100 border-t border-blue-200 shadow-inner pt-12 pb-6 px-4 md:px-10 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Top section with logo and newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-10 border-b border-blue-100">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="bg-blue-500 text-white p-3 rounded-lg mr-3 shadow-md">
              <Globe size={24} />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">DirassaTech</h2>
          </div>
          
          <div className="w-full md:w-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  id="newsletter" 
                  type="email" 
                  placeholder="Your email address" 
                  className="pl-10 p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white w-full shadow-sm" 
                  required
                />
              </div>
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-5 py-3 rounded-r-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Subscribe <Send size={16} className="ml-2" />
              </button>
            </form>
          </div>
        </div>
        
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center mb-4">
              <BookOpen size={20} className="text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">About Us</h3>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              DirassaTech is your gateway to online learning, providing quality courses and resources for students, teachers, and academies worldwide. Join our community today and transform your educational journey.
            </p>
            <div className="flex space-x-3 mt-6">
              <a href="#" className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-blue-600 hover:text-white hover:bg-blue-600 transform hover:-translate-y-1">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-blue-400 hover:text-white hover:bg-blue-400 transform hover:-translate-y-1">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-pink-600 hover:text-white hover:bg-pink-600 transform hover:-translate-y-1">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-blue-700 hover:text-white hover:bg-blue-700 transform hover:-translate-y-1">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <Globe size={20} className="text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
            </div>
            <ul className="space-y-3">
              {[
                { path: "/", label: "Home" },
                { path: "/courses", label: "Courses" },
                { path: "/academies", label: "Academies" },
                { path: "/about", label: "About Us" },
                { path: "/contact", label: "Contact" }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.path);
                    }} 
                    className="flex items-center text-gray-600 hover:text-blue-500 transition-colors duration-300 group"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <Award size={20} className="text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Our Services</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Online Courses",
                "Academy Management",
                "Teacher Training",
                "Student Resources",
                "Certification Programs"
              ].map((service, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <Phone size={20} className="text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Get in Touch</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone size={18} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-600">0782 68 46 01</span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-600">info@dirassatech.com</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Bachjarah, Algiers, Algeria</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright section */}
      <div className="border-t border-blue-100 mt-12 pt-6 text-center">
        <p className="text-gray-600 font-medium">
          &copy; {new Date().getFullYear()} <span className="font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">DirassaTech</span>. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer