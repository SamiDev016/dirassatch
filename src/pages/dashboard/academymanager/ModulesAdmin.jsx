import { useEffect, useState } from "react";
import { getAllModules, createModule, updateModule } from "../../../utils/auth";
import { PlusCircle, Edit2, Check, X } from "lucide-react";

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Modules Admin</h1>

      {/* Create new module */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
          placeholder="Enter module name"
          className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
        >
          <PlusCircle size={16} /> Add Module
        </button>
      </div>

      {/* List modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <div
            key={module.id}
            className="p-4 rounded-xl border bg-white shadow hover:shadow-lg transform transition-all duration-200 hover:scale-[1.02] flex items-center justify-between"
          >
            {editingId === module.id ? (
              <div className="flex gap-2 flex-1 items-center">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="border rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-transform transform hover:scale-105"
                >
                  <Check size={16} /> Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg transition-transform transform hover:scale-105"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            ) : (
              <>
                <span className="font-medium">{module.name}</span>
                <button
                  onClick={() => handleEdit(module.id, module.name)}
                  className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition-transform transform hover:scale-105"
                >
                  <Edit2 size={16} /> Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
