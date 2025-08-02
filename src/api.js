// src/api.js

const BASE_URL = 'https://j-study.onrender.com';

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }
  const data = await response.json();
  if (data.Response === "False") {
    throw new Error(data.Message);
  }
  return data;
};

export const fetchCourses = async () => {
  const response = await fetch(`${BASE_URL}/course/all`);
  return handleResponse(response);
};

export const fetchAcademies = async () => {
  const response = await fetch(`${BASE_URL}/academy/all`);
  return handleResponse(response);
};
