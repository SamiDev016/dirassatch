import { useEffect, useState } from "react";
import {
  getCoursesByAcademy,
  createCourse,
  getAllModules,
} from "../../../utils/auth";
import { PlusCircle, BookOpen, Users, DollarSign, Trash2, X, Search, Filter, Clock, GraduationCap, Tag } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("selectedAcademyId");
    if (stored) setAcademyId(stored);
  }, []);

  useEffect(() => {
    if (!academyId) return;
    fetchCourses();
    fetchModules();
  }, [academyId]);
  console.log("🔵 [CoursesAdmin] Academy ID:", academyId);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      
      const response = await getCoursesByAcademy({ academyId });
      setCourses(response || []);
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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChapterChange = (index, field, value) => {
    const updated = [...chapters];
    updated[index][field] = value;
    setChapters(updated);
  };

  const addChapter = () =>
    setChapters([...chapters, { title: "", content: "" }]);
  const removeChapter = (index) =>
    setChapters(chapters.filter((_, i) => i !== index));

  const handleCreate = async () => {
    try {
      const payload = {
        ...formData,
        academyId, // still string from localStorage, we'll fix in createCourse
        minAge: formData.minAge,
        maxAge: formData.maxAge,
        price: formData.price,
        chapters, // pass array, not stringified
      };
  
      await createCourse(payload);
      console.log("✅ Course created successfully!", payload);
  
      // reset form
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
      alert("❌ Error creating course.");
      console.error("Error creating course:", error);
    }
  };
  

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" /> 
            Courses Management
          </h1>
          <p className="text-gray-500 mt-1">Create and manage courses for your academy</p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow transform hover:scale-105"
        >
          <PlusCircle className="h-5 w-5" />
          New Course
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow-sm rounded-2xl p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">Filter</span>
            </button>
            <select className="border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition">
              <option value="">All Modules</option>
              {modules.map(module => (
                <option key={module.id} value={module.id}>{module.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-10">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-700 font-medium">No courses found</p>
          <p className="text-gray-500 text-sm mt-1">{searchTerm ? "Try a different search term" : "Create your first course using the button above"}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-white flex flex-col transform transition-all hover:shadow-xl hover:border-blue-200 duration-300"
            >
              <div className="relative">
                {course.cover ? (
                  <img
                    src={course.cover}
                    alt={course.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-blue-500" />
                  </div>
                )}
                {course.moduleId && modules.find(m => m.id === course.moduleId) && (
                   <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                     <Tag className="h-3 w-3" />
                     {modules.find(m => m.id === course.moduleId)?.name}
                   </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen size={18} /> {course.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                  {course.description}
                </p>
                <div className="mt-3 text-sm text-gray-500 space-y-1">
                  <p className="flex items-center gap-1">
                    <Users size={16} /> {course.targetAudience}
                  </p>
                  <p className="flex items-center gap-1">
                    <DollarSign size={16} /> {course.price} DZ
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog / Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4  bg-opacity-50 ${
          isDialogOpen
            ? "opacity-100 bg-opacity-40 transition-opacity duration-300"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ${
            isDialogOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold">Create Course</h2>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Course Name"
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <select
              value={formData.moduleId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, moduleId: e.target.value }))
              }
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select Module</option>
              {modules.map((module) => (
                <option key={module.id} value={String(module.id)}>
                  {module.name}
                </option>
              ))}
            </select>

            <input
              name="cover"
              value={formData.cover}
              onChange={handleChange}
              placeholder="Cover Image URL"
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              placeholder="Target Audience"
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleChange}
              placeholder="Prerequisites"
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              name="whatYouWillLearn"
              value={formData.whatYouWillLearn}
              onChange={handleChange}
              placeholder="What You Will Learn"
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              name="whatYouCanDoAfter"
              value={formData.whatYouCanDoAfter}
              onChange={handleChange}
              placeholder="What You Can Do After"
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <div className="flex gap-2">
              <input
                type="number"
                name="minAge"
                value={formData.minAge}
                onChange={handleChange}
                placeholder="Min Age"
                className="border rounded p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <input
                type="number"
                name="maxAge"
                value={formData.maxAge}
                onChange={handleChange}
                placeholder="Max Age"
                className="border rounded p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            {/* Chapters */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Chapters</h3>
              {chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="mb-3 bg-gray-50 p-3 rounded-lg border space-y-2 transform transition-all duration-200 hover:scale-[1.01]"
                >
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e) =>
                      handleChapterChange(index, "title", e.target.value)
                    }
                    placeholder="Chapter Title"
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <textarea
                    value={chapter.content}
                    onChange={(e) =>
                      handleChapterChange(index, "content", e.target.value)
                    }
                    placeholder="Chapter Content"
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => removeChapter(index)}
                    className="flex items-center gap-1 text-red-600 text-sm hover:text-red-800 transition"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addChapter}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-transform duration-200 hover:scale-105"
              >
                <PlusCircle size={16} /> Add Chapter
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 p-4 border-t sticky bottom-0 bg-white z-10">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 rounded border hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-transform duration-200 hover:scale-105"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
