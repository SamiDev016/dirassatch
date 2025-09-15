import { useState, useEffect } from "react";
import {
  createSection,
  getSectionsByChapter,
  updateSection,
  deleteSection,
  getChaptersByCourse,
  getCoursesByAcademy,
} from "../../../utils/auth";

export default function SectionsAdmin() {
  const [academyId, setAcademyId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    order: 1,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load academyId
  useEffect(() => {
    const stored = localStorage.getItem("selectedAcademyId");
    if (stored) {
      setAcademyId(stored);
    }
  }, []);

  // Fetch courses
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
  

  const fetchSections = async (chapterId) => {
    try {
      const data = await getSectionsByChapter({ chapterId });
      setSections(data || []);
    } catch (err) {
      console.error("Error fetching sections:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (formData.id) {
        await updateSection({
          sectionId: formData.id,
          ...formData,
          chapterId: Number(selectedChapter),
        });
      } else {
        await createSection({
          ...formData,
          chapterId: Number(selectedChapter),
        });
      }
      setIsDialogOpen(false);
      setFormData({ id: null, name: "", description: "", order: 1 });
      fetchSections(selectedChapter);
    } catch (err) {
      console.error("Error saving section:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this section?")) return;
    await deleteSection({ sectionId: id });
    fetchSections(selectedChapter);
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
      <h1 className="text-2xl font-bold">Sections Management</h1>

      {/* Course Selector */}
      <div>
        <label className="block mb-2">Select Course</label>
        <select
          value={selectedCourse || ""}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            fetchChapters(e.target.value);
            setSelectedChapter(null);
            setSections([]);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">-- Choose a course --</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chapter Selector */}
      {selectedCourse && (
        <div>
          <label className="block mb-2">Select Chapter</label>
          <select
            value={selectedChapter || ""}
            onChange={(e) => {
              setSelectedChapter(e.target.value);
              fetchSections(e.target.value);
            }}
            className="border px-3 py-2 rounded"
          >
            <option value="">-- Choose a chapter --</option>
            {chapters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sections List */}
      {selectedChapter && (
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Sections</h2>
            <button
              onClick={() => {
                setFormData({ id: null, name: "", description: "", order: 1 });
                setIsDialogOpen(true);
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Add Section
            </button>
          </div>

          {sections.length === 0 ? (
            <p>No sections found.</p>
          ) : (
            <ul className="divide-y">
              {sections.map((s) => (
                <li key={s.id} className="py-2 flex justify-between">
                  <div>
                    <strong>{s.name}</strong> - {s.description} (Order: {s.order})
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setFormData(s);
                        setIsDialogOpen(true);
                      }}
                      className="px-2 py-1 bg-slate-100 text-blue-600 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="px-2 py-1 bg-slate-100 text-red-600 rounded"
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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {formData.id ? "Edit Section" : "New Section"}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Section Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Order"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
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
