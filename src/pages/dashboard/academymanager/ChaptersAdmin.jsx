import { useState, useEffect } from "react";
import {
  createChapter,
  getChaptersByCourse,
  updateChapter,
  deleteChapter,
  getCoursesByAcademy,
} from "../../../utils/auth";
import { BookOpen, Plus, Edit, Trash } from "lucide-react";

export default function ChaptersAdmin() {
  const [academyId, setAcademyId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    order: 1,
    isPublished: false,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("selectedAcademyId");
    if (stored) {
      setAcademyId(stored);
    }
  }, []);

  useEffect(() => {
    if (!academyId) return;
    fetchCourses();
  }, [academyId]);

  const fetchCourses = async () => {
    try {
      const data = await getCoursesByAcademy({ academyId });
      setCourses(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setLoading(false);
    }
  };

  const fetchChapters = async (courseId) => {
    try {
      const data = await getChaptersByCourse({ id: courseId });
      setChapters(data || []);
    } catch (err) {
      console.error("Error fetching chapters:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (formData.id) {
        await updateChapter({
          ...formData,
          courseId: Number(selectedCourse),
        });
      } else {
        await createChapter({
          ...formData,
          courseId: Number(selectedCourse),
        });
      }
      setIsDialogOpen(false);
      setFormData({ id: null, name: "", description: "", order: 1, isPublished: false });
      fetchChapters(selectedCourse);
    } catch (err) {
      console.error("Error saving chapter:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this chapter?")) return;
    await deleteChapter({ id });
    fetchChapters(selectedCourse);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" /> Chapters Management
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Create and manage chapters for courses in this academy.
        </p>
      </div>

      {/* Course Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Select Course
        </label>
        <select
          value={selectedCourse || ""}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            fetchChapters(e.target.value);
          }}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Choose a course --</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chapters List */}
      {selectedCourse && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Chapters</h2>
            <button
              onClick={() => {
                setFormData({ id: null, name: "", description: "", order: 1, isPublished: false });
                setIsDialogOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add Chapter
            </button>
          </div>

          {chapters.length === 0 ? (
            <p className="text-slate-500 text-sm">No chapters found for this course.</p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {chapters.map((ch) => (
                <li
                  key={ch.id}
                  className="py-4 flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-semibold text-slate-900">{ch.name}</h3>
                    <p className="text-sm text-slate-600">{ch.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Order: {ch.order} |{" "}
                      {ch.isPublished ? (
                        <span className="text-green-600 font-medium">Published</span>
                      ) : (
                        <span className="text-red-500 font-medium">Draft</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setFormData(ch);
                        setIsDialogOpen(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-blue-600 text-sm"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ch.id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-red-50 text-red-600 text-sm"
                    >
                      <Trash className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-slate-900">
              {formData.id ? "Edit Chapter" : "New Chapter"}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Chapter Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Order"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Published
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
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
