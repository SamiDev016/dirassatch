import { getCoursesByAcademy, createCourse, getCourseById, getAllModules } from "../../../utils/auth";
import { useEffect, useState } from "react";

export default function CoursesAdmin() {
    const [academyId, setAcademyId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    cover: "",
    moduleId: "",
    name: "",
    description: "",
    targetAudience: "",
    prerequisites: "",
    whatYouWillLearn: "",
    whatYouCanDoAfter: "",
    minAge: "",
    maxAge: "",
    price: "",
  });

  const [chapters, setChapters] = useState([{ title: "", content: "" }]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedAcademyId");
    if (stored) {
      setAcademyId(stored);
    }
  }, []);

  useEffect(() => {
    if (!academyId) return; 
    fetchCourses();
    fetchModules();
  }, [academyId]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await getCoursesByAcademy({ academyId });
      setCourses(response || []);
      console.log(academyId);
      console.log(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setLoading(false);
  };

  const fetchModules = async () => {
    try {
      const response = await getAllModules({ academyId });
      setModules(response || []);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChapterChange = (index, field, value) => {
    const updated = [...chapters];
    updated[index][field] = value;
    setChapters(updated);
  };

  const addChapter = () => {
    setChapters([...chapters, { title: "", content: "" }]);
  };

  const removeChapter = (index) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    try {
      const payload = {
        ...formData,
        academyId,
        minAge: parseInt(formData.minAge) || null,
        maxAge: parseInt(formData.maxAge) || null,
        price: parseFloat(formData.price) || 0,
        chapters: JSON.stringify(
          chapters.map((ch, index) => ({
            name: ch.title,
            description: ch.content,
            order: index + 1,
          }))
        ),
      };
  
      console.log("Sending payload:", payload); // debug log
  
      await createCourse(payload);
      setIsDialogOpen(false);
      setFormData({
        cover: "",
        moduleId: "",
        name: "",
        description: "",
        targetAudience: "",
        prerequisites: "",
        whatYouWillLearn: "",
        whatYouCanDoAfter: "",
        minAge: "",
        maxAge: "",
        price: "",
      });
      setChapters([{ title: "", content: "" }]);
      fetchCourses();
    } catch (error) {
      alert("Error creating course.");
      console.error("Error creating course:", error);
    }
  };
  

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses Admin</h1>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          + New Course
        </button>
      </div>

      {/* Courses List */}
      {loading ? (
        <div className="text-gray-600">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="text-gray-500">No courses found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md p-4 border"
            >
              {course.cover && (
                <img
                  src={course.cover}
                  alt={course.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <h2 className="font-semibold text-lg">{course.name}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">
                {course.description}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                🎯 Audience: {course.targetAudience}
              </p>
              <p className="text-sm text-gray-500">💰 {course.price} DZ</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Create Course</h2>
            <div className="grid gap-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Course Name"
                className="border rounded p-2"
              />
              <select
                name="moduleId"
                value={formData.moduleId}
                onChange={handleChange}
                className="border rounded p-2"
              >
                <option value="">Select Module</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
              <input
                name="cover"
                value={formData.cover}
                onChange={handleChange}
                placeholder="Cover Image URL"
                className="border rounded p-2"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="border rounded p-2"
              />
              <input
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="Target Audience"
                className="border rounded p-2"
              />
              <input
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleChange}
                placeholder="Prerequisites"
                className="border rounded p-2"
              />
              <input
                name="whatYouWillLearn"
                value={formData.whatYouWillLearn}
                onChange={handleChange}
                placeholder="What You Will Learn"
                className="border rounded p-2"
              />
              <input
                name="whatYouCanDoAfter"
                value={formData.whatYouCanDoAfter}
                onChange={handleChange}
                placeholder="What You Can Do After"
                className="border rounded p-2"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minAge"
                  value={formData.minAge}
                  onChange={handleChange}
                  placeholder="Min Age"
                  className="border rounded p-2 w-1/2"
                />
                <input
                  type="number"
                  name="maxAge"
                  value={formData.maxAge}
                  onChange={handleChange}
                  placeholder="Max Age"
                  className="border rounded p-2 w-1/2"
                />
              </div>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="border rounded p-2"
              />

              {/* Chapters */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Chapters</h3>
                {chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className="border rounded p-3 mb-3 bg-gray-50"
                  >
                    <input
                      type="text"
                      value={chapter.title}
                      onChange={(e) =>
                        handleChapterChange(index, "title", e.target.value)
                      }
                      placeholder="Chapter Title"
                      className="border rounded p-2 w-full mb-2"
                    />
                    <textarea
                      value={chapter.content}
                      onChange={(e) =>
                        handleChapterChange(index, "content", e.target.value)
                      }
                      placeholder="Chapter Content"
                      className="border rounded p-2 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeChapter(index)}
                      className="mt-2 text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addChapter}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  + Add Chapter
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
