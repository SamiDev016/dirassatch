import { useEffect, useState } from "react";
import {
  getUserData,
  getGroupsByCourse,
  getChaptersByCourse,
  getSectionsByChapter,
  getAllSupportsBySection,
  createSupport,
  updateSupport,
  deleteSupport,
  getSupportById,
} from "../../../utils/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Video,
  Link,
  BookOpen,
  Plus,
  Edit,
  Trash,
  Eye,
  EyeOff,
  Upload,
  X,
  Save,
  FolderOpen,
  Layers,
  File,
  CheckCircle,
  Clock,
  Users,
  ExternalLink,
} from "lucide-react";

export default function TeacherDashboardSupport() {
  // State management
  const [supports, setSupports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSupport, setEditingSupport] = useState(null);
  
  // Data hierarchy state
  const [teacherGroups, setTeacherGroups] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "document",
    url: "",
    content: "",
    isPublished: true,
    order: 1,
    sectionId: "",
    fileData: null,
  });

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      await fetchTeacherData();
    };
    initializeData();
  }, []);

  // Fetch supports when section changes
  useEffect(() => {
    if (selectedSection) {
      fetchSupports();
    }
  }, [selectedSection]);

  // Fetch teacher data and hierarchy
  async function fetchTeacherData() {
    const userData = await getUserData();
    if (userData && userData.groups) {
      // Filter groups where user is a teacher
      const teacherGroupsList = userData.groups.filter(group => group.role === 'TEACHER');
      setTeacherGroups(teacherGroupsList);
      
      if (teacherGroupsList.length > 0) {
        // Fetch chapters for the first teacher group's course
        const firstGroup = teacherGroupsList[0];
        if (firstGroup.course) {
          await fetchChapters(firstGroup.course.id);
        }
      }
    }
    setLoading(false);
  }

  // Fetch chapters for a course
  async function fetchChapters(courseId) {
    const result = await getChaptersByCourse({ courseId });
    if (result) {
      setChapters(result);
      if (result.length > 0) {
        await fetchSections(result[0].id);
      }
    }
  }

  // Fetch sections for a chapter
  async function fetchSections(chapterId) {
    const result = await getSectionsByChapter({ chapterId });
    if (result) {
      setSections(result);
      if (result.length > 0 && !selectedSection) {
        setSelectedSection(result[0].id);
      }
    }
  }

  // Fetch supports for selected section
  async function fetchSupports() {
    if (!selectedSection) return;
    
    setLoading(true);
    const result = await getAllSupportsBySection({ sectionId: selectedSection });
    if (result) {
      setSupports(result);
    }
    setLoading(false);
  }

  // Handle form input changes
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  // Handle file upload
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
      // Store the actual file object for upload
      setFormData(prev => ({
        ...prev,
        fileData: file
      }));
      
      console.log('🔍 File selected for upload:', file.name);
    }
  }

  // Open form for creating/editing
  function openForm(support = null) {
    if (support) {
      setEditingSupport(support);
      setFormData({
        title: support.title,
        description: support.description,
        type: support.type,
        url: support.url || "",
        content: support.content || "",
        isPublished: support.isPublished,
        order: support.order,
        sectionId: support.sectionId,
        fileData: support.fileData || null,
      });
    } else {
      setEditingSupport(null);
      // Ensure we have a valid sectionId
      const currentSectionId = selectedSection || (sections.length > 0 ? sections[0].id : "");
      console.log('🔍 Setting up new support form with sectionId:', currentSectionId);
      setFormData({
        title: "",
        description: "",
        type: "document",
        url: "",
        content: "",
        isPublished: true,
        order: supports.length + 1,
        sectionId: currentSectionId,
        fileData: null,
      });
    }
    setShowForm(true);
  }

  // Close form
  function closeForm() {
    setShowForm(false);
    setEditingSupport(null);
  }

  // Submit form (create/update)
  async function submitForm(e) {
    e.preventDefault();
    
    console.log('🔍 submitForm called with formData:', formData);
    
    // Prepare support data for API
    const supportData = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      url: formData.url,
      content: formData.content,
      isPublished: formData.isPublished,
      order: formData.order,
      sectionId: formData.sectionId,
      fileData: formData.fileData,
    };
    
    console.log('🔍 supportData prepared:', {
      ...supportData,
      fileData: supportData.fileData ? 'File data present' : 'No file data',
      fileName: supportData.fileData?.name || 'N/A',
      fileSize: supportData.fileData?.size || 0
    });

    let result;
    if (editingSupport) {
      console.log('🔍 Updating existing support:', editingSupport.id);
      result = await updateSupport({
        supportId: editingSupport.id,
        ...supportData
      });
    } else {
      console.log('🔍 Creating new support');
      result = await createSupport(supportData);
    }
    
    console.log('🔍 API result:', result);
    
    // Check if the API returned a URL for the uploaded file
    if (result && result.url) {
      console.log('🟢 File uploaded successfully, URL:', result.url);
      // Update the form data with the returned URL
      setFormData(prev => ({
        ...prev,
        url: result.url
      }));
    } else if (result && formData.fileData) {
      console.log('🟡 No URL returned from API, but file was uploaded');
    }

    if (result) {
      console.log('🟢 Support created/updated successfully, refreshing supports list');
      await fetchSupports();
      closeForm();
    } else {
      console.log('🔴 Failed to create/update support');
    }
  }

  // Preview support - handle file uploads and content
  function previewSupport(support) {
    console.log('🔍 Previewing support:', support);
    
    // Check if API returned a URL (for uploaded files)
    if (support.url) {
      console.log('🔍 Opening URL:', support.url);
      window.open(support.url, '_blank', 'noopener,noreferrer');
    } 
    // Handle content-based types
    else if (support.type === 'exercise' && support.content) {
      alert(`Exercise:\n\n${support.content}`);
    }
    // Handle file-based types (documents, videos)
    else if (support.type === 'document' || support.type === 'video') {
      if (support.fileData) {
        console.log('🔍 File data available but no URL returned from API');
        alert('File uploaded successfully! The file will be available for download once processed by the server.');
      } else {
        alert(`No file available for this ${support.type}`);
      }
    }
    // Handle link types
    else if (support.type === 'link') {
      alert('No URL available for this link');
    }
    else {
      alert(`No preview available for this ${support.type}`);
    }
  }

  // Delete support
  async function deleteSupportItem(supportId) {
    if (window.confirm('Are you sure you want to delete this support item?')) {
      const result = await deleteSupport({ supportId });
      if (result) {
        await fetchSupports();
      }
    }
  }

  // Get icon for support type
  function getTypeIcon(type) {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'link': return <Link className="w-4 h-4" />;
      case 'exercise': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  }

  // Get type color
  function getTypeColor(type) {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'link': return 'bg-blue-100 text-blue-800';
      case 'exercise': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <FolderOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Support Materials</h1>
                <p className="text-gray-600 mt-1">Manage learning resources and course materials</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openForm()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Support</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Section Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Layers className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">Select Section</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map(section => (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSection(section.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedSection === section.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{section.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Support List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <File className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">Support Materials</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {supports.length} items
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : supports.length === 0 ? (
            <div className="text-center py-12">
              <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No support materials yet</h3>
              <p className="text-gray-600 mb-6">Add your first support material to get started</p>
              <button
                onClick={() => openForm()}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Add Support Material
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supports.map((support, index) => (
                <motion.div
                  key={support.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(support.type)}`}>
                        {getTypeIcon(support.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{support.title}</h3>
                        <span className="text-sm text-gray-600 capitalize">{support.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {support.isPublished ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-500">#{support.order}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {support.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {support.isPublished ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Published
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Preview button - only show if there's content to preview */}
                      {(support.type === 'link' && support.url) || 
                       (support.type === 'video' && support.url) || 
                       (support.type === 'exercise' && support.content) || 
                       (support.type === 'document') ? (
                        <button
                          onClick={() => previewSupport(support)}
                          className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      ) : null}
                      <button
                        onClick={() => openForm(support)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSupportItem(support.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Support Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingSupport ? 'Edit Support' : 'Add New Support'}
                  </h2>
                  <button
                    onClick={closeForm}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={submitForm} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter support title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="document">Document</option>
                      <option value="video">Video</option>
                      <option value="link">Link</option>
                      <option value="exercise">Exercise</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter support description"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(formData.type === 'video' || formData.type === 'link') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL {formData.type === 'video' ? '(YouTube/Vimeo)' : '(External Link)'}
                      </label>
                      <input
                        type="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        required={formData.type === 'video' || formData.type === 'link'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={formData.type === 'video' ? 'https://youtube.com/watch?v=...' : 'https://example.com'}
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order *
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                
                {(formData.type === 'exercise' || formData.type === 'document') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content {formData.type === 'exercise' ? '(Exercise Instructions)' : '(Document Description)'}
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows={4}
                      required={formData.type === 'exercise'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={formData.type === 'exercise' ? 'Enter exercise instructions and details...' : 'Enter document description and details...'}
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      Choose File
                    </label>
                    {formData.fileData && (
                      <p className="text-sm text-green-600 mt-2">File selected</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Published</span>
                  </label>
                </div>
                
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingSupport ? 'Update' : 'Create'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}