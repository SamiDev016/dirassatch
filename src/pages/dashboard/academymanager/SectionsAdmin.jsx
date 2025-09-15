import { useState, useEffect } from "react";
import {
  createSection,
  getSectionsByChapter,
  updateSection,
  deleteSection,
  getChaptersByCourse,
  getCoursesByAcademy,
} from "../../../utils/auth";
import { FileText, Plus, Edit, Trash } from "lucide-react";

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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" /> Sections Management
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Create and manage sections for chapters in this academy.
        </p>
      </div>

      {/* Course Selector */}
      <div className="bg-white rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Course
        </label>
        <select
          value={selectedCourse || ""}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            fetchChapters(e.target.value);
            setSelectedChapter(null);
            setSections([]);
          }}
          className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
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
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Chapter
          </label>
          <select
            value={selectedChapter || ""}
            onChange={(e) => {
              setSelectedChapter(e.target.value);
              fetchSections(e.target.value);
            }}
            className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
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
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Sections</h2>
            <button
              onClick={() => {
                setFormData({ id: null, name: "", description: "", order: 1 });
                setIsDialogOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Section
            </button>
          </div>

          {sections.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-sm">No sections found for this chapter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sections.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{s.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600 max-w-xs truncate">{s.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{s.order}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setFormData(s);
                              setIsDialogOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {formData.id ? "Edit Section" : "New Section"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
                <input
                  type="text"
                  placeholder="Enter section name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  placeholder="Enter order"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) })
                  }
                  className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
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
