
import Search from "../components/Search"
import Spinner from "../components/Spinner"
import AcademyCard from "../components/AcademyCard"
import { useOutletContext } from "react-router-dom"
import PostCard from "../components/PostCard"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper/modules';

const Home = () => {
  const {search,setSearch,academies, errorMessage, isLoading, posts } = useOutletContext();
  return (
    <div className="p-5">
      {/* <div className="flex justify-center mb-6">
      <Search search={search} setSearch={setSearch} />
      </div> */}

      <h1 className="text-xl font-bold mb-6">Academies Posts</h1>
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
      </div>

      <h1 className="text-xl font-bold mb-6">Featured Academies</h1>
      {errorMessage && <p className="text-red-500 mb-6">{errorMessage.toString()}</p>}
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {academies.map(academy => (
          <AcademyCard key={academy.id} academy={academy} />
        ))}
      </div>
      )}

      
    </div>
  );
};

export default Home
