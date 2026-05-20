// src/pages/Tasks.jsx
// Tasks page with list, create, edit, filter, and status management

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Modal from "../components/Modal";
import TaskCard from "../components/TaskCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineClipboardCheck,
} from "react-icons/hi";

const Tasks = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [overdueFilter, setOverdueFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Data for dropdowns
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });

  // Fetch tasks when filters change
  useEffect(() => {
    fetchTasks();
  }, [page, search, statusFilter, priorityFilter, projectFilter, overdueFilter]);

  // Fetch projects and users for form dropdowns
  useEffect(() => {
    fetchProjects();
    if (isAdmin) {
      fetchUsers();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let url = "/tasks?page=" + page + "&limit=12";
      if (search) url += "&search=" + search;
      if (statusFilter) url += "&status=" + statusFilter;
      if (priorityFilter) url += "&priority=" + priorityFilter;
      if (projectFilter) url += "&project=" + projectFilter;
      if (overdueFilter) url += "&overdue=true";

      const response = await API.get(url);
      setTasks(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await API.get("/projects?limit=100");
      setProjects(response.data.data);
    } catch (error) {
      console.error("Failed to load projects");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await API.get("/auth/users");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Failed to load users");
    }
  };

  // Create a new task
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", formData);
      toast.success("Task created successfully");
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        project: "",
        assignedTo: "",
        priority: "medium",
        dueDate: "",
      });
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    }
  };

  // Update a task
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await API.put("/tasks/" + selectedTask._id, formData);
      toast.success("Task updated successfully");
      setShowEditModal(false);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  // Update task status inline
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.put("/tasks/" + taskId, { status: newStatus });
      toast.success("Status updated");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Open edit modal
  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      project: task.project?._id || "",
      assignedTo: task.assignedTo?._id || "",
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
    setShowEditModal(true);
  };

  // Delete a task
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    try {
      await API.delete("/tasks/" + taskId);
      toast.success("Task deleted");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  // Input style helper
  const inputStyle = {
    backgroundColor: "var(--color-bg-tertiary)",
    borderColor: "var(--color-border)",
    color: "var(--color-text-primary)",
  };

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Tasks
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {isAdmin ? "Manage all tasks" : "View your assigned tasks"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setFormData({
                title: "",
                description: "",
                project: "",
                assignedTo: "",
                priority: "medium",
                dueDate: "",
              });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm hover:from-indigo-600 hover:to-purple-700 transition-all shadow-sm "
          >
            <HiOutlinePlus className="w-4 h-4" />
            New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div
        className="rounded-sm p-4 border mb-6"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <HiOutlineFilter
            className="w-4 h-4"
            style={{ color: "var(--color-text-muted)" }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Filters
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <HiOutlineSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--color-text-muted)" }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-4 py-2 rounded-sm border text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              style={inputStyle}
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-sm border text-sm outline-none cursor-pointer"
            style={inputStyle}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-sm border text-sm outline-none cursor-pointer"
            style={inputStyle}
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Project */}
          <select
            value={projectFilter}
            onChange={(e) => {
              setProjectFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-sm border text-sm outline-none cursor-pointer"
            style={inputStyle}
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Overdue toggle */}
          <label className="flex items-center gap-2 px-3 py-2 rounded-sm border cursor-pointer" style={inputStyle}>
            <input
              type="checkbox"
              checked={overdueFilter}
              onChange={(e) => {
                setOverdueFilter(e.target.checked);
                setPage(1);
              }}
              className="w-4 h-4 rounded accent-indigo-500"
            />
            <span className="text-sm" style={{ color: "var(--color-text-primary)" }}>
              Overdue Only
            </span>
          </label>
        </div>
      </div>

      {/* Tasks grid */}
      {loading ? (
        <LoadingSpinner text="Loading tasks..." />
      ) : tasks.length === 0 ? (
        <div
          className="text-center py-16 rounded-sm border"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderColor: "var(--color-border)",
          }}
        >
          <HiOutlineClipboardCheck
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: "var(--color-text-muted)" }}
          />
          <p style={{ color: "var(--color-text-secondary)" }}>
            No tasks found
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div key={task._id} className="relative group">
                <TaskCard
                  task={task}
                  onClick={isAdmin ? openEditModal : undefined}
                  onStatusChange={handleStatusChange}
                  showProject={true}
                />
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task._id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-sm bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete task"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
              Task Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter task title"
              className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Describe the task"
              className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
                Project
              </label>
              <select
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none cursor-pointer"
                style={inputStyle}
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
                Assign To
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none cursor-pointer"
                style={inputStyle}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none cursor-pointer"
                style={inputStyle}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-sm text-sm font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Task"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
              Task Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none cursor-pointer"
                style={inputStyle}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none cursor-pointer"
                style={inputStyle}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
                Assign To
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none cursor-pointer"
                style={inputStyle}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 rounded-sm text-sm font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
