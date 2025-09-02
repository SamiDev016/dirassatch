import { useEffect, useState } from "react";
import {
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupsByAcademy,
  addMemberToGroup,
  removeMemberFromGroup,
  getAllMembersOfGroup,
  getCoursesByAcademy
} from "../../../utils/auth";

export default function GroupsAdmin() {
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: "", courseId: "" });
  const [memberForm, setMemberForm] = useState({ userId: "", role: "STUDENT" });
  const [loading, setLoading] = useState(false);

  const [academyId, setAcademyId] = useState(null);

  // Load academyId from localStorage once
useEffect(() => {
    const stored = localStorage.getItem("selectedAcademyId");
    if (stored) {
      setAcademyId(Number(stored)); // make sure it's a number
    }
  }, []);
  
  // Run fetches when academyId is ready
  useEffect(() => {
    if (academyId) {
      fetchGroups();
      fetchCourses();
    }
  }, [academyId]);
  

  async function fetchGroups() {
    setLoading(true);
    const data = await getGroupsByAcademy({academyId});
    if (data) setGroups(data);
    setLoading(false);
  }

  async function fetchCourses() {
    setLoading(true);
    const data = await getCoursesByAcademy({academyId});
    if (data) setCourses(data);
    setLoading(false);
  }

  async function handleSaveGroup(e) {
    e.preventDefault();
    if (formData.id) {
      await updateGroup({
        ...formData,
        courseId: Number(formData.courseId),
      });
    } else {
      await createGroup({
        name: formData.name,
        courseId: Number(formData.courseId),
      });
    }
    setFormData({ id: null, name: "", courseId: "" });
    fetchGroups();
  }

  async function handleDeleteGroup(id) {
    if (!confirm("Are you sure you want to delete this group?")) return;
    await deleteGroup({ id });
    fetchGroups();
  }

  async function handleSelectGroup(group) {
    setSelectedGroup(group);
    const members = await getAllMembersOfGroup({ groupId: group.id });
    if (members) setMembers(members);
  }

  async function handleAddMember(e) {
    e.preventDefault();
    if (!selectedGroup) return;
    await addMemberToGroup({
      userId: Number(memberForm.userId),
      groupId: selectedGroup.id,
      role: memberForm.role,
    });
    setMemberForm({ userId: "", role: "STUDENT" });
    handleSelectGroup(selectedGroup);
  }

  async function handleRemoveMember(userId) {
    if (!selectedGroup) return;
    await removeMemberFromGroup({ userId, groupId: selectedGroup.id });
    handleSelectGroup(selectedGroup);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Groups Admin</h1>

      {/* Group Form */}
      <form onSubmit={handleSaveGroup} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Group Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border rounded p-2 w-full"
          required
        />
        <select
          placeholder="Course ID"
          value={formData.courseId}
          onChange={(e) =>
            setFormData({ ...formData, courseId: e.target.value })
          }
          className="border rounded p-2 w-full"
          required
        >
            <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {formData.id ? "Update Group" : "Create Group"}
        </button>
      </form>

      {/* Groups List */}
      {loading ? (
        <p>Loading groups...</p>
      ) : (
        <ul className="space-y-2">
          {groups.map((g) => (
            <li
              key={g.id}
              className="border rounded p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{g.name}</p>
                <p className="text-sm text-gray-500">Course ID: {g.courseId}</p>
              </div>
              <div className="space-x-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => setFormData(g)}
                >
                  Edit
                </button>
                <button
                  className="bg-indigo-500 text-white px-2 py-1 rounded"
                  onClick={() => handleSelectGroup(g)}
                >
                  Members
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteGroup(g.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Members Management */}
      {selectedGroup && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">
            Members of {selectedGroup.name}
          </h2>
          <form onSubmit={handleAddMember} className="flex space-x-2 mb-4">
            <input
              type="number"
              placeholder="User ID"
              value={memberForm.userId}
              onChange={(e) =>
                setMemberForm({ ...memberForm, userId: e.target.value })
              }
              className="border rounded p-2"
              required
            />
            <select
              value={memberForm.role}
              onChange={(e) =>
                setMemberForm({ ...memberForm, role: e.target.value })
              }
              className="border rounded p-2"
            >
              <option value="STUDENT">STUDENT</option>
              <option value="TEACHER">TEACHER</option>
              <option value="ASSISTANT">ASSISTANT</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </form>

          <ul className="space-y-2">
            {members.map((m) => (
              <li
                key={m.userId}
                className="border rounded p-2 flex justify-between"
              >
                <span>
                  {m.userId} — {m.role}
                </span>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleRemoveMember(m.userId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
