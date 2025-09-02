import { useEffect, useState } from "react";
import { PlusCircle, Edit2, Check, X, Layers, Search, Filter, Trash2 } from "lucide-react";
import { getAllModules, createModule, updateModule } from "../../../utils/auth";

export default function ModulesAdmin() {
  const [modules, setModules] = useState([]);
  const [newModuleName, setNewModuleName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await getAllModules();
      setModules(response);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const handleCreate = async () => {
    if (!newModuleName.trim()) return;
    try {
      await createModule({ name: newModuleName });
      setNewModuleName("");
      fetchModules();
    } catch (error) {
      console.error("Error creating module:", error);
    }
  };

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSave = async () => {
    try {
      await updateModule({ id: editingId, name: editingName });
      setEditingId(null);
      setEditingName("");
      fetchModules();
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Layers className="h-6 w-6 text-blue-600" /> 
            Modules Management
          </h1>
          <p className="text-gray-500 mt-1">Create and organize modules for your courses</p>
        </div>
      </div>

      {/* Search and Create */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-blue-600" />
            Create New Module
          </h2>
        </div>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                placeholder="Enter module name"
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <PlusCircle className="h-4 w-4" />
              Add Module
            </button>
          </div>
        </div>
      </div>

      {/* List modules */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            Available Modules
          </h2>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search modules..."
              className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
          </div>
        </div>
        
        <div className="p-4">
          {modules.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <Layers className="h-10 w-10 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-700 font-medium">No modules found</p>
              <p className="text-gray-500 text-sm mt-1">Create your first module using the form above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transform transition-all duration-200 hover:scale-[1.02]"
                >
                  {editingId === module.id ? (
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 text-sm"
                        >
                          <Check className="h-4 w-4" /> Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm"
                        >
                          <X className="h-4 w-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Layers className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-800">{module.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(module.id, module.name)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                          title="Edit Module"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                          title="Delete Module"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
