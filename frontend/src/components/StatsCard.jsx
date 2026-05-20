// src/components/StatsCard.jsx
// Reusable statistics card for the dashboard

const StatsCard = ({ title, value, icon: Icon, color, trend }) => {
  // Color themes for different stat types
  const colorClasses = {
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      icon: "text-indigo-500",
      border: "border-indigo-100 dark:border-indigo-500/20",
    },
    green: {
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      icon: "text-emerald-500",
      border: "border-emerald-100 dark:border-emerald-500/20",
    },
    yellow: {
      bg: "bg-amber-50 dark:bg-amber-500/10",
      icon: "text-amber-500",
      border: "border-amber-100 dark:border-amber-500/20",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-500/10",
      icon: "text-red-500",
      border: "border-red-100 dark:border-red-500/20",
    },
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-500/10",
      icon: "text-cyan-500",
      border: "border-cyan-100 dark:border-cyan-500/20",
    },
  };

  const theme = colorClasses[color] || colorClasses.indigo;

  return (
    <div
      className={
        "rounded-sm p-5 border transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5 " +
        theme.border
      }
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {title}
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {value}
          </p>
          {trend && (
            <p className="text-xs mt-1 text-emerald-500 font-medium">
              {trend}
            </p>
          )}
        </div>
        <div className={"p-3 rounded-sm " + theme.bg}>
          {Icon && <Icon className={"w-6 h-6 " + theme.icon} />}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
