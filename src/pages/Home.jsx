
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

      <div className="flex flex-row items-center gap-5 justify-center mb-8 shadow-md rounded p-5 w-1/2 mx-auto hover:shadow-lg transition cursor-pointer">
        <img src="https://img.freepik.com/free-photo/medium-shot-students-studying-together_23-2148950552.jpg?semt=ais_hybrid&w=740" alt="" className="h-96 object-cover"/>
        <div className="w-1/2 flex flex-col space-y-2 items-center gap-2">
          <h2 className="flex flex-col justify-center items-center text-2xl font-bold mb-2">About US</h2>
          <p className="flex flex-col justify-center items-center text-gray-700">Dirassa Tech is The First Choice For Learning.</p>
          <p className="flex flex-col justify-center items-center text-gray-700">We are here to help you learn and grow.</p>
          <div className="flex flex-row justify-center items-center gap-2"> 
            <button className="p-2 rounded border border-gray-300 bg-green-500 text-white cursor-pointer hover:bg-green-600 transition">0 Available Course</button>
            <button className="p-2 rounded border border-gray-300 bg-blue-500 text-white cursor-pointer hover:bg-blue-600 transition">0 Available Academy</button>
            <button className="p-2 rounded border border-gray-300 bg-red-500 text-white cursor-pointer hover:bg-red-600 transition">0 Available Teacher</button>
            <button className="p-2 rounded border border-gray-300 bg-yellow-500 text-white cursor-pointer hover:bg-yellow-600 transition">0 Happy Parent</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10 justify-center bg-gradient-to-tr from-blue-50 via-white to-blue-100 border-t border-blue-200 shadow-inner py-10" style={{margin: "0 auto", width: "100%"}}>
        
        <div className="flex flex-col gap-4 max-w-xl">
          <h1 className="text-3xl font-bold text-gray-800">Why You Choose Us</h1>
          <p className="text-gray-700 leading-relaxed">
            Aliquyam accusam clita nonumy ipsum sit sea clita ipsum clita, ipsum dolores amet voluptua duo dolores et sit
            ipsum rebum, sadipscing et erat eirmod diam kasd labore clita est. Diam sanctus gubergren sit rebum clita amet.
          </p>

          <div className="flex flex-col gap-4 mt-4">
            <FeatureBox color="bg-green-500 cursor-pointer hover:bg-green-600 transition" text="Skilled Instructors" />
            <FeatureBox color="bg-blue-500 cursor-pointer hover:bg-blue-600 transition" text="International Certificate" />
            <FeatureBox color="bg-red-500 cursor-pointer hover:bg-red-600 transition" text="Online Learning" />
          </div>
        </div>

        <img
          src="https://media.istockphoto.com/id/1463491717/photo/group-of-happy-friends-students-sitting-in-a-cafe-bar-looking-at-laptop.jpg?s=612x612&w=0&k=20&c=bZdMdi22DhbbJ6xDAHZUPWHZ9-xywB0ddWAapd4eeQg="
          alt="Group of people learning"
          className="w-full max-w-md rounded-lg shadow-lg"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-800 my-6">Checkout New Releases Of Our Courses</h1>
        <Swiper
          spaceBetween={24}
          slidesPerView={1}
          navigation
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          style={{ paddingBottom: "40px" }}
        >
          {courses.map(course => (
            <SwiperSlide key={course.id}>
              <CourseCard course={course} isFromHome={true}/>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      <div>
      <h1 className="text-xl font-bold my-6">Featured Academies</h1>
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
          style={{ paddingBottom: "40px" }}
        >
          {academies.map(academy => (
            <SwiperSlide key={academy.id}>
              <AcademyCard academy={academy} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      </div>

      <div className="bg-gradient-to-tr from-blue-50 via-white to-blue-100 border-t border-blue-200 shadow-inner p-10">
      <div className="flex flex-col items-center justify-center bg-white p-10 shadow my-10 w-1/2 mx-auto rounded-2xl">
        <h1 className="text-2xl font-bold mb-6">30% Off For New Academies</h1>
        <div>
          <form action="" className="">
            <div className="flex flex-row gap-5">
              <input type="text" placeholder="Academy Name" className="w-1/2 p-2 rounded mb-2 border border-gray-300 focus:outline-none focus:border-blue-500 bg-blue-50"/>
              <input type="email" placeholder="Email" className="w-1/2 p-2 rounded mb-2 border border-gray-300 focus:outline-none focus:border-blue-500 bg-blue-50" />
            </div>
            <div className="flex flex-row gap-5">
              <input type="text" placeholder="Phone Number" className="w-1/2 p-2 rounded mb-2 border border-gray-300 focus:outline-none focus:border-blue-500 bg-blue-50" />
              <input type="submit" value="Join Us Now" className="w-1/2 p-2 rounded bg-blue-500 text-white cursor-pointer hover:bg-blue-600 transition"/>
            </div>
          </form>
        </div>
        </div>
      </div>


      
      <div className="flex flex-col items-center justify-center my-10">
        <h1 className="text-2xl font-bold mb-6">Meet Our Best Teachers</h1>
        <div className="flex flex-row items-center justify-center ">
          <div className="flex flex-col items-center justify-center gap-5">
            <img src="https://t3.ftcdn.net/jpg/13/94/80/06/360_F_1394800689_dU4bmN7Zk1dB1SiLOdtijnwGWCDZsQeA.jpg" alt="" className="w-1/2 rounded-full hover:shadow-lg transition cursor-pointer"/>
            <p className="text-2xl font-bold">Mokrani</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-5">
            <img src="https://t3.ftcdn.net/jpg/13/94/80/06/360_F_1394800689_dU4bmN7Zk1dB1SiLOdtijnwGWCDZsQeA.jpg" alt="" className="w-1/2 rounded-full hover:shadow-lg transition cursor-pointer"/>
            <p className="text-2xl font-bold">Said</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-5">
            <img src="https://t3.ftcdn.net/jpg/13/94/80/06/360_F_1394800689_dU4bmN7Zk1dB1SiLOdtijnwGWCDZsQeA.jpg" alt="" className="w-1/2 rounded-full hover:shadow-lg transition cursor-pointer"/>
            <p className="text-2xl font-bold">Mostafa</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-5">
            <img src="https://t3.ftcdn.net/jpg/13/94/80/06/360_F_1394800689_dU4bmN7Zk1dB1SiLOdtijnwGWCDZsQeA.jpg" alt="" className="w-1/2 rounded-full hover:shadow-lg transition cursor-pointer"/>
            <p className="text-2xl font-bold">Amine</p>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Home
