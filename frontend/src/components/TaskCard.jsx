// src/components/TaskCard.jsx
// Reusable task card component for displaying task information

import { HiOutlineCalendar, HiOutlineUser, HiOutlineFlag } from "react-icons/hi";

const TaskCard = ({ task, onClick, onStatusChange, showProject = false }) => {
  // Priority color mapping
  const priorityColors = {
    low: {
      bg: "bg-blue-50 dark:bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      label: "Low",
    },
    medium: {
      bg: "bg-amber-50 dark:bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      label: "Medium",
    },
    high: {
      bg: "bg-red-50 dark:bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      label: "High",
    },
  };

  // Status color mapping
  const statusColors = {
    pending: {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-600 dark:text-gray-300",
      label: "Pending",
    },
    "in-progress": {
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      text: "text-indigo-600 dark:text-indigo-400",
      label: "In Progress",
    },
    completed: {
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      label: "Completed",
    },
  };

  const priority = priorityColors[task.priority] || priorityColors.medium;
  const status = statusColors[task.status] || statusColors.pending;

  // Check if task is overdue
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "No due date";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={
        "rounded-xl p-4 border transition-all duration-200 hover:shadow-md cursor-pointer " +
        (isOverdue
          ? "border-red-300 dark:border-red-500/30"
          : "")
      }
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        borderColor: isOverdue ? undefined : "var(--color-border)",
      }}
      onClick={() => onClick && onClick(task)}
    >
      {/* Top row: priority and status */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={
            "px-2 py-0.5 rounded-full text-xs font-medium " +
            priority.bg +
            " " +
            priority.text
          }
        >
          <HiOutlineFlag className="w-3 h-3 inline mr-1" />
          {priority.label}
        </span>

        {onStatusChange ? (
          <select
            value={task.status}
            onChange={(e) => {
              e.stopPropagation();
              onStatusChange(task._id, e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className={
              "px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer " +
              status.bg +
              " " +
              status.text
            }
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        ) : (
          <span
            className={
              "px-2 py-0.5 rounded-full text-xs font-medium " +
              status.bg +
              " " +
              status.text
            }
          >
            {status.label}
          </span>
        )}
      </div>

      {/* Task title */}
      <h3
        className={
          "font-semibold text-sm mb-1 line-clamp-2 " +
          (task.status === "completed" ? "line-through opacity-60" : "")
        }
        style={{ color: "var(--color-text-primary)" }}
      >
        {task.title}
      </h3>

      {/* Description preview */}
      {task.description && (
        <p
          className="text-xs mb-3 line-clamp-2"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {task.description}
        </p>
      )}

      {/* Project name if shown */}
      {showProject && task.project && (
        <p
          className="text-xs mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Project: {task.project.name || "Unknown"}
        </p>
      )}

      {/* Bottom row: assigned user and due date */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-1.5">
          <HiOutlineUser className="w-3.5 h-3.5" style={{ color: "var(--color-text-muted)" }} />
          <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            {task.assignedTo?.name || "Unassigned"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <HiOutlineCalendar
            className={"w-3.5 h-3.5 " + (isOverdue ? "text-red-500" : "")}
            style={isOverdue ? {} : { color: "var(--color-text-muted)" }}
          />
          <span
            className={"text-xs font-medium " + (isOverdue ? "text-red-500" : "")}
            style={isOverdue ? {} : { color: "var(--color-text-secondary)" }}
          >
            {formatDate(task.dueDate)}
            {isOverdue && " (Overdue)"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
