import { useEffect, useState } from "react";
import { getAllModules, createModule, updateModule} from "../../../utils/auth";

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
        console.log(id);
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
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Modules Admin</h1>

            {/* Create new module */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    placeholder="Enter module name"
                    className="border px-2 py-1 rounded"
                />
                <button
                    onClick={handleCreate}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                >
                    Add Module
                </button>
            </div>

            {/* List modules */}
            <ul className="space-y-2">
                {modules.map((module) => (
                    <li key={module.id} className="flex items-center gap-2">
                        {editingId === module.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="border px-2 py-1 rounded"
                                />
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="bg-gray-400 text-white px-3 py-1 rounded"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <span>{module.name}</span>
                                <button
                                    onClick={() => handleEdit(module.id, module.name)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                >
                                    Edit
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
