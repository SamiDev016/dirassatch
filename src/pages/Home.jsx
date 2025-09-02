
import Search from "../components/Search"
import Spinner from "../components/Spinner"
import AcademyCard from "../components/AcademyCard"
import { useOutletContext } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import CourseCard from "../components/CourseCard"
import PersonCard from "../components/PersonCard"

function FeatureBox({ color, text }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full ${color} border-2 border-white shadow-md transition duration-300 hover:scale-105`}></div>
      <p className="text-gray-800 font-medium cursor-pointer hover:text-gray-600 transition">{text}</p>
    </div>
  );
}



const Home = () => {
  const {search,setSearch,academies, errorMessage, isLoading, posts, courses } = useOutletContext();

  return (
    <div className="p-5">
      <div id="slider" className="flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-2">Learn Eveywhere</h2>
        <p className="text-center">Dirassa Tech is a platform that provides a wide range of educational resources and opportunities for students, teachers, and academies to learn and grow.</p>
        {/* <div className="flex items-center gap-2 w-1/2">
                <input
                    type="text"
                    placeholder="Search Academies"
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer text-white"
                />
                <button
                    type="button"
                    disabled
                    className="cursor-pointer hover:bg-blue-600 text-white rounded-lg p-2 transition flex items-center justify-center"
                >
                    <img src="../public/search.svg" alt="search" className="w-5 h-5" />
                </button>
            </div> */}
      </div>


      {/* <h1 className="text-xl font-bold mb-6">Academies Posts</h1>
      <div className="mb-8 cursor-pointer">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={2}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          style={{ paddingBottom: "40px" }}
        >
          {errorMessage && <p className="text-red-500 mb-6">{errorMessage.toString()}</p>}
          {isLoading ? (
            <Spinner />
          ) : (
            posts.map(post => (
              <SwiperSlide key={post.id}>
                <PostCard post={post} />
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div> */}

      <div className="py-16 px-4 my-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row">
            <div className="md:w-1/2 relative">
              <img 
                src="https://img.freepik.com/free-photo/medium-shot-students-studying-together_23-2148950552.jpg?semt=ais_hybrid&w=740" 
                alt="Students studying together" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent"></div>
            </div>
            
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 relative">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">About DirassaTech</span>
                <span className="block w-20 h-1 bg-blue-500 mt-2"></span>
              </h2>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                DirassaTech is the premier choice for online learning, connecting students with expert educators and quality resources. Our platform is designed to make education accessible, engaging, and effective for learners of all ages and backgrounds.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center transition-transform duration-300 hover:transform hover:scale-105">
                  <span className="text-2xl font-bold text-blue-600">{courses.length || 0}</span>
                  <span className="text-gray-600 text-sm">Available Courses</span>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center transition-transform duration-300 hover:transform hover:scale-105">
                  <span className="text-2xl font-bold text-green-600">{academies.length || 0}</span>
                  <span className="text-gray-600 text-sm">Partner Academies</span>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center transition-transform duration-300 hover:transform hover:scale-105">
                  <span className="text-2xl font-bold text-amber-600">24</span>
                  <span className="text-gray-600 text-sm">Expert Teachers</span>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center transition-transform duration-300 hover:transform hover:scale-105">
                  <span className="text-2xl font-bold text-purple-600">1200+</span>
                  <span className="text-gray-600 text-sm">Happy Students</span>
                </div>
              </div>
              
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg font-medium self-start">
                Learn More About Us
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-tr from-blue-50 via-white to-blue-100 border-t border-blue-200 shadow-inner py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose DirassaTech</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We're committed to providing the best educational experience with our innovative platform and expert instructors.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-10 justify-between">
            <div className="md:w-1/2 order-2 md:order-1">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 relative">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Our Advantages</span>
                  <span className="block w-20 h-1 bg-blue-500 mt-2"></span>
                </h3>
                
                <p className="text-gray-700 mb-8 leading-relaxed">
                  DirassaTech offers a comprehensive learning experience with cutting-edge technology, personalized learning paths, and a supportive community of educators and students from around the world.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-green-500 text-white p-3 rounded-lg mr-4 shadow-md flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">Expert Instructors</h4>
                      <p className="text-gray-600">Learn from industry professionals and academic experts with years of teaching experience.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-500 text-white p-3 rounded-lg mr-4 shadow-md flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="7"></circle>
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">Recognized Certification</h4>
                      <p className="text-gray-600">Earn certificates that are recognized by educational institutions and employers worldwide.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-amber-500 text-white p-3 rounded-lg mr-4 shadow-md flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">Flexible Learning</h4>
                      <p className="text-gray-600">Access courses anytime, anywhere with our mobile-friendly platform and downloadable resources.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 order-1 md:order-2">
              <div className="relative">
                <img
                  src="https://media.istockphoto.com/id/1463491717/photo/group-of-happy-friends-students-sitting-in-a-cafe-bar-looking-at-laptop.jpg?s=612x612&w=0&k=20&c=bZdMdi22DhbbJ6xDAHZUPWHZ9-xywB0ddWAapd4eeQg="
                  alt="Group of people learning"
                  className="w-full rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg transform rotate-3">
                  <span className="font-bold text-xl">Join 5000+ Students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Our Latest Courses</span>
              <span className="block w-24 h-1 bg-blue-500 mx-auto mt-2"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Expand your knowledge with our newest and most in-demand courses taught by industry experts.</p>
          </div>
          
          <div className="relative px-4">
            <Swiper
              spaceBetween={24}
              slidesPerView={1}
              navigation
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="mySwiper py-8"
              style={{ paddingBottom: "40px" }}
            >
              {courses.map(course => (
                <SwiperSlide key={course.id}>
                  <CourseCard course={course} isFromHome={true}/>
                </SwiperSlide>
              ))}
            </Swiper>
            
            <div className="absolute -top-4 -right-4 bg-amber-500 text-white py-2 px-4 rounded-lg shadow-lg transform rotate-3 z-10">
              <span className="font-bold">New & Trending</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Featured Academies</span>
              <span className="block w-24 h-1 bg-blue-500 mx-auto mt-2"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover our partner academies offering exceptional educational programs and resources.</p>
          </div>
          
          <div className="relative px-4">
            {errorMessage && <p className="text-red-500 mb-6">{errorMessage.toString()}</p>}
            {isLoading ? (
              <Spinner />
            ) : (
              <Swiper
                spaceBetween={24}
                slidesPerView={1}
                navigation
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="mySwiper py-8"
                style={{ paddingBottom: "40px" }}
              >
                {academies.map(academy => (
                  <SwiperSlide key={academy.id}>
                    <AcademyCard academy={academy} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            
            <div className="absolute -top-4 -left-4 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg transform -rotate-3 z-10">
              <span className="font-bold">Top Rated</span>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-lg flex items-center mx-auto">
              View All Academies
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="mb-6 md:mb-0 md:w-1/2">
              <div className="relative">
                <div className="absolute -top-10 -left-10 bg-yellow-400 text-blue-900 py-3 px-6 rounded-lg shadow-lg transform -rotate-6 z-10">
                  <span className="font-bold text-xl">Limited Time Offer!</span>
                </div>
                <h2 className="text-4xl font-bold mb-4">30% Off For New Academies</h2>
                <div className="w-24 h-1 bg-yellow-400 mb-6"></div>
                <p className="text-white text-opacity-90 text-lg mb-8">
                  Join our platform as a new academy and receive an exclusive 30% discount on your first year subscription. Gain access to our comprehensive tools, resources, and a growing community of eager students.                
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-blue-500 bg-opacity-30 px-4 py-3 rounded-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>Full Platform Access</span>
                  </div>
                  <div className="bg-blue-500 bg-opacity-30 px-4 py-3 rounded-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>Marketing Support</span>
                  </div>
                  <div className="bg-blue-500 bg-opacity-30 px-4 py-3 rounded-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>Student Analytics</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 max-w-md w-full">
              <div className="bg-white p-8 rounded-2xl shadow-2xl transform rotate-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 relative">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Sign Up Now</span>
                  <span className="block w-16 h-1 bg-blue-500 mt-2"></span>
                </h3>
                <form>
                  <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Your Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Your Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Academy Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Your Academy Name"
                        className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg flex items-center justify-center"
                  >
                    Get Your 30% Discount
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                  <p className="text-gray-500 text-sm text-center mt-4">Limited time offer. Terms and conditions apply.</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>


      
      <div className="bg-gradient-to-tr from-blue-50 via-white to-blue-100 border-t border-blue-200 shadow-inner py-16 px-4 my-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Expert Teachers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our team of dedicated educators brings years of experience and passion to help you achieve your learning goals.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                id: 1,
                name: "Dr. Mokrani Ahmed",
                photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                role: "Senior Instructor",
                specialty: "Computer Science",
                studentCount: "120",
                courseCount: "8",
                email: "mokrani@dirassatech.com"
              },
              {
                id: 2,
                name: "Prof. Said Karim",
                photo: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80",
                role: "Lead Educator",
                specialty: "Mathematics",
                studentCount: "95",
                courseCount: "6",
                email: "said@dirassatech.com"
              },
              {
                id: 3,
                name: "Dr. Mostafa Riad",
                photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                role: "Senior Instructor",
                specialty: "Physics",
                studentCount: "85",
                courseCount: "5",
                email: "mostafa@dirassatech.com"
              },
              {
                id: 4,
                name: "Prof. Amine Khalid",
                photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                role: "Instructor",
                specialty: "Chemistry",
                studentCount: "75",
                courseCount: "4",
                email: "amine@dirassatech.com"
              }
            ].map(teacher => (
              <PersonCard key={teacher.id} person={teacher} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg font-medium">
              View All Teachers
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Home
