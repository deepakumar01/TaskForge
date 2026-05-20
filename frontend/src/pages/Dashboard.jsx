// src/pages/Dashboard.jsx
// Main dashboard page with statistics and charts

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import StatsCard from "../components/StatsCard";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import {
  HiOutlineCollection,
  HiOutlineClipboardCheck,
  HiOutlineClock,
  HiOutlineExclamation,
  HiOutlineTrendingUp,
  HiOutlineCheckCircle,
  HiOutlineChartBar,
} from "react-icons/hi";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activitiesRes] = await Promise.all([
        API.get("/dashboard/stats"),
        API.get("/dashboard/activities?limit=10"),
      ]);
      setStats(statsRes.data.data);
      setActivities(activitiesRes.data.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  // Calculate progress percentage
  const completionRate =
    stats && stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  // Format activity timestamp
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return diffMins + " min ago";
    if (diffHours < 24) return diffHours + " hr ago";
    if (diffDays < 7) return diffDays + " day ago";
    return date.toLocaleDateString();
  };

  // Activity action label mapping
  const actionLabels = {
    created_project: "Created project",
    updated_project: "Updated project",
    deleted_project: "Deleted project",
    added_member: "Added member to",
    removed_member: "Removed member from",
    created_task: "Created task",
    updated_task: "Updated task",
    deleted_task: "Deleted task",
    completed_task: "Completed task",
    status_change: "Changed status of",
  };

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Dashboard
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Overview of your projects and tasks
        </p>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Projects"
          value={stats?.totalProjects || 0}
          icon={HiOutlineCollection}
          color="indigo"
        />
        <StatsCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          icon={HiOutlineCheckCircle}
          color="green"
        />
        <StatsCard
          title="Pending Tasks"
          value={stats?.pendingTasks || 0}
          icon={HiOutlineClock}
          color="yellow"
        />
        <StatsCard
          title="Overdue Tasks"
          value={stats?.overdueTasks || 0}
          icon={HiOutlineExclamation}
          color="red"
        />
      </div>

      {/* Charts and Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Progress Overview */}
        <div
          className="lg:col-span-1 rounded-xl p-6 border"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderColor: "var(--color-border)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-6 flex items-center gap-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            <HiOutlineTrendingUp className="w-5 h-5 text-indigo-500" />
            Progress Overview
          </h3>

          {/* Circular progress indicator */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={
                    2 * Math.PI * 52 * (1 - completionRate / 100)
                  }
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {completionRate}%
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Complete
                </span>
              </div>
            </div>
          </div>

          {/* Stats breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                In Progress
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {stats?.inProgressTasks || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Active Projects
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {stats?.activeProjects || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Task Distribution by Priority */}
        <div
          className="lg:col-span-1 rounded-xl p-6 border"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderColor: "var(--color-border)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-6 flex items-center gap-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            <HiOutlineChartBar className="w-5 h-5 text-indigo-500" />
            Priority Breakdown
          </h3>

          <div className="space-y-4">
            {/* High priority */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-red-500">
                  High Priority
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {stats?.highPriorityTasks || 0}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-700"
                  style={{
                    width:
                      (stats?.totalTasks > 0
                        ? ((stats?.highPriorityTasks || 0) / stats.totalTasks) *
                          100
                        : 0) + "%",
                  }}
                />
              </div>
            </div>

            {/* Medium priority */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-amber-500">
                  Medium Priority
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {stats?.mediumPriorityTasks || 0}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700"
                  style={{
                    width:
                      (stats?.totalTasks > 0
                        ? ((stats?.mediumPriorityTasks || 0) /
                            stats.totalTasks) *
                          100
                        : 0) + "%",
                  }}
                />
              </div>
            </div>

            {/* Low priority */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-blue-500">
                  Low Priority
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {stats?.lowPriorityTasks || 0}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700"
                  style={{
                    width:
                      (stats?.totalTasks > 0
                        ? ((stats?.lowPriorityTasks || 0) / stats.totalTasks) *
                          100
                        : 0) + "%",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Total tasks info */}
          <div
            className="mt-6 pt-4 border-t text-center"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {stats?.totalTasks || 0}
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Total Tasks
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className="lg:col-span-1 rounded-xl p-6 border"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderColor: "var(--color-border)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            <HiOutlineClipboardCheck className="w-5 h-5 text-indigo-500" />
            Recent Activity
          </h3>

          {activities.length === 0 ? (
            <div className="text-center py-8">
              <p
                className="text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                No recent activity
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {activities.slice(0, 8).map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-semibold text-xs">
                      {activity.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm leading-snug"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      <span className="font-medium">
                        {activity.user?.name || "Unknown"}
                      </span>{" "}
                      <span style={{ color: "var(--color-text-secondary)" }}>
                        {activity.description}
                      </span>
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {formatTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
