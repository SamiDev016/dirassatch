import { useState, useEffect } from "react";
import {
  createChapter,
  getChaptersByCourse,
  updateChapter,
  deleteChapter,
} from "../../../utils/auth";
import { getCoursesByAcademy } from "../../../utils/auth";

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

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chapters Admin</h1>

      {/* Course Selector */}
      <select
        value={selectedCourse || ""}
        onChange={(e) => {
          setSelectedCourse(e.target.value);
          fetchChapters(e.target.value);
        }}
        className="border rounded p-2 mb-4"
      >
        <option value="">Select a Course</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Chapters List */}
      {selectedCourse && (
        <div>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            + Add Chapter
          </button>

          {chapters.length === 0 ? (
            <p className="text-gray-500">No chapters found.</p>
          ) : (
            <ul className="space-y-3">
              {chapters.map((ch) => (
                <li
                  key={ch.id}
                  className="border p-3 rounded flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{ch.name}</h3>
                    <p className="text-sm text-gray-600">{ch.description}</p>
                    <p className="text-xs text-gray-400">
                      Order: {ch.order} |{" "}
                      {ch.isPublished ? "✅ Published" : "❌ Draft"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setFormData(ch);
                        setIsDialogOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ch.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
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
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {formData.id ? "Edit Chapter" : "New Chapter"}
            </h2>
            <input
              type="text"
              placeholder="Chapter Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border rounded p-2 w-full mb-2"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="border rounded p-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Order"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              className="border rounded p-2 w-full mb-2"
            />
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData({ ...formData, isPublished: e.target.checked })
                }
              />
              Published
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
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
