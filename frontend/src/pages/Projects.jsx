// src/pages/Projects.jsx
// Projects page with list, create, edit, and delete functionality

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineUserAdd,
  HiOutlineSearch,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineCollection,
} from "react-icons/hi";

const Projects = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    deadline: "",
    status: "active",
  });

  // Members management
  const [allUsers, setAllUsers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");

  // Fetch projects when filters change
  useEffect(() => {
    fetchProjects();
  }, [page, search, statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let url = "/projects?page=" + page + "&limit=9";
      if (search) url += "&search=" + search;
      if (statusFilter) url += "&status=" + statusFilter;

      const response = await API.get(url);
      setProjects(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users for member assignment
  const fetchUsers = async () => {
    try {
      const response = await API.get("/auth/users");
      setAllUsers(response.data.data);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  // Create a new project
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projects", formData);
      toast.success("Project created successfully");
      setShowCreateModal(false);
      setFormData({ name: "", description: "", deadline: "", status: "active" });
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  // Update an existing project
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await API.put("/projects/" + selectedProject._id, formData);
      toast.success("Project updated successfully");
      setShowEditModal(false);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project");
    }
  };

  // Delete a project
  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project? All tasks will also be deleted.")) {
      return;
    }
    try {
      await API.delete("/projects/" + projectId);
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  // Open edit modal with project data
  const openEditModal = (project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description || "",
      deadline: project.deadline ? project.deadline.split("T")[0] : "",
      status: project.status,
    });
    setShowEditModal(true);
  };

  // Open member management modal
  const openMemberModal = (project) => {
    setSelectedProject(project);
    fetchUsers();
    setShowMemberModal(true);
  };

  // Add a member to a project
  const handleAddMember = async () => {
    if (!selectedMember) return;
    try {
      await API.put("/projects/" + selectedProject._id + "/members", {
        userId: selectedMember,
      });
      toast.success("Member added successfully");
      setSelectedMember("");
      // Refresh the project data
      const response = await API.get("/projects/" + selectedProject._id);
      setSelectedProject(response.data.data);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  };

  // Remove a member from a project
  const handleRemoveMember = async (userId) => {
    try {
      await API.delete(
        "/projects/" + selectedProject._id + "/members/" + userId
      );
      toast.success("Member removed successfully");
      const response = await API.get("/projects/" + selectedProject._id);
      setSelectedProject(response.data.data);
      fetchProjects();
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "No deadline";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Status badge colors
  const statusBadge = (status) => {
    const colors = {
      active: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      completed: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
      archived: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
    };
    return colors[status] || colors.active;
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
            Projects
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Manage your team projects
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setFormData({ name: "", description: "", deadline: "", status: "active" });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm hover:from-indigo-600 hover:to-purple-700 transition-all shadow-sm "
          >
            <HiOutlinePlus className="w-4 h-4" />
            New Project
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
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
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2.5 rounded-sm border text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 rounded-sm border text-sm outline-none cursor-pointer"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Projects grid */}
      {loading ? (
        <LoadingSpinner text="Loading projects..." />
      ) : projects.length === 0 ? (
        <div
          className="text-center py-16 rounded-sm border"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderColor: "var(--color-border)",
          }}
        >
          <HiOutlineCollection
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: "var(--color-text-muted)" }}
          />
          <p style={{ color: "var(--color-text-secondary)" }}>
            No projects found
          </p>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-3 text-indigo-500 font-medium text-sm hover:text-indigo-600"
            >
              Create your first project
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="rounded-sm p-5 border transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5"
                style={{
                  backgroundColor: "var(--color-bg-secondary)",
                  borderColor: "var(--color-border)",
                }}
              >
                {/* Project header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3
                      className="font-semibold text-base"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {project.name}
                    </h3>
                    <span
                      className={
                        "inline-block mt-1 px-2 py-0.5 rounded-sm text-xs font-medium " +
                        statusBadge(project.status)
                      }
                    >
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openMemberModal(project)}
                        className="p-1.5 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Manage Members"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <HiOutlineUserAdd className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(project)}
                        className="p-1.5 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Edit"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="p-1.5 rounded-sm hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"
                        title="Delete"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                {project.description && (
                  <p
                    className="text-sm mb-4 line-clamp-2"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {project.description}
                  </p>
                )}

                {/* Footer */}
                <div
                  className="flex items-center justify-between pt-3 border-t"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <HiOutlineUserGroup
                      className="w-4 h-4"
                      style={{ color: "var(--color-text-muted)" }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {project.members?.length || 0} members
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HiOutlineCalendar
                      className="w-4 h-4"
                      style={{ color: "var(--color-text-muted)" }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {formatDate(project.deadline)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--color-text-primary)" }}
            >
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              style={{
                backgroundColor: "var(--color-bg-tertiary)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--color-text-primary)" }}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              style={{
                backgroundColor: "var(--color-bg-tertiary)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
              placeholder="Describe your project"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--color-text-primary)" }}
            >
              Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              style={{
                backgroundColor: "var(--color-bg-tertiary)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-sm text-sm font-medium transition-colors"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--color-text-primary)" }}
            >
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              style={{
                backgroundColor: "var(--color-bg-tertiary)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--color-text-primary)" }}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              style={{
                backgroundColor: "var(--color-bg-tertiary)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--color-text-primary)" }}
            >
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              style={{
                backgroundColor: "var(--color-bg-tertiary)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--color-text-primary)" }}
            >
              Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-sm border text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              style={{
                backgroundColor: "var(--color-bg-tertiary)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 rounded-sm text-sm font-medium transition-colors"
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

      {/* Manage Members Modal */}
      <Modal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        title={"Members - " + (selectedProject?.name || "")}
        size="md"
      >
        <div className="space-y-4">
          {/* Add member section */}
          <div className="flex gap-2">
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-sm border text-sm outline-none"
              style={{
                backgroundColor: "var(--color-bg-tertiary)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            >
              <option value="">Select a user to add</option>
              {allUsers
                .filter(
                  (u) =>
                    !selectedProject?.members?.some(
                      (m) => m._id === u._id
                    )
                )
                .map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
            </select>
            <button
              onClick={handleAddMember}
              disabled={!selectedMember}
              className="px-4 py-2 rounded-sm bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50"
            >
              Add
            </button>
          </div>

          {/* Current members list */}
          <div className="space-y-2">
            <h4
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Current Members ({selectedProject?.members?.length || 0})
            </h4>
            {selectedProject?.members?.length === 0 ? (
              <p
                className="text-sm py-4 text-center"
                style={{ color: "var(--color-text-muted)" }}
              >
                No members yet
              </p>
            ) : (
              selectedProject?.members?.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-3 rounded-sm"
                  style={{ backgroundColor: "var(--color-bg-tertiary)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {member.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {member.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 rounded-sm transition-colors"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Projects;
