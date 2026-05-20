// src/pages/Activity.jsx
// Activity log page showing all recent actions

import { useState, useEffect } from "react";
import API from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import {
  HiOutlineCollection,
  HiOutlineClipboardCheck,
  HiOutlineUserAdd,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineCheckCircle,
  HiOutlineSwitchHorizontal,
} from "react-icons/hi";

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await API.get("/dashboard/activities?limit=50");
      setActivities(response.data.data);
    } catch (error) {
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  // Map action types to icons and colors
  const getActionIcon = (action) => {
    const iconMap = {
      created_project: { icon: HiOutlineCollection, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
      updated_project: { icon: HiOutlinePencil, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
      deleted_project: { icon: HiOutlineTrash, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10" },
      added_member: { icon: HiOutlineUserAdd, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
      removed_member: { icon: HiOutlineUserAdd, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
      created_task: { icon: HiOutlineClipboardCheck, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
      updated_task: { icon: HiOutlinePencil, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
      deleted_task: { icon: HiOutlineTrash, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10" },
      completed_task: { icon: HiOutlineCheckCircle, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
      status_change: { icon: HiOutlineSwitchHorizontal, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-500/10" },
    };
    return iconMap[action] || iconMap.status_change;
  };

  // Format timestamp
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return diffMins + " minutes ago";
    if (diffHours < 24) return diffHours + " hours ago";
    if (diffDays < 7) return diffDays + " days ago";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading activity..." />;
  }

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Activity Log
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Track all actions performed in the workspace
        </p>
      </div>

      {/* Activity timeline */}
      <div
        className="rounded-sm border overflow-hidden"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          borderColor: "var(--color-border)",
        }}
      >
        {activities.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: "var(--color-text-muted)" }}>
              No activity recorded yet
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {activities.map((activity, index) => {
              const actionStyle = getActionIcon(activity.action);
              const IconComponent = actionStyle.icon;

              return (
                <div
                  key={activity._id}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors animate-fade-in"
                  style={{ animationDelay: index * 30 + "ms" }}
                >
                  {/* Action icon */}
                  <div
                    className={
                      "w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 " +
                      actionStyle.bg
                    }
                  >
                    <IconComponent className={"w-5 h-5 " + actionStyle.color} />
                  </div>

                  {/* Activity details */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {formatTime(activity.createdAt)}
                      </span>
                      {activity.project && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-sm"
                          style={{
                            backgroundColor: "var(--color-bg-tertiary)",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {activity.project.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* User avatar */}
                  <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-xs">
                      {activity.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
