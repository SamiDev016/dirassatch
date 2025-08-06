
import './App.css'
import { useState, useEffect } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import { Outlet } from 'react-router-dom'



const App = () => {
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [academies, setAcademies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [courses, setCourses] = useState([]);

  const API_BASE = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : "/api";

  const fetchAcademies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/academy/all`);
      if(!response.ok){
        throw new Error("Failed to fetch academies.");
      }
      const data = await response.json();
      if(data.Response === "False"){
        setErrorMessage(data.Message);
      }
      setAcademies(data.slice(0, 8));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message || "Failed to academies.");
    }
  };
///post/all
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/post/all`);
      if(!response.ok){
        throw new Error("Failed to fetch posts.");
      }
      const data = await response.json();
      if(data.Response === "False"){
        setErrorMessage(data.Message);
      }
      setPosts(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message || "Failed to posts.");
    }
  };

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/course/all`);
      if(!response.ok){
        throw new Error("Failed to fetch courses.");
      }
      const data = await response.json();
      if(data.Response === "False"){
        setErrorMessage(data.Message);
      }
      setCourses(data.slice(0, 8));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message || "Failed to courses.");
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchAcademies();
    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <Outlet context={{
        search,
        setSearch,
        academies,
        errorMessage,
        isLoading,
        posts,
        courses
      }} />
      <Footer />
    </div>
  );
};

export default App
