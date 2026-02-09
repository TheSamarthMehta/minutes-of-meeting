import React, { ReactNode } from "react";
import { Eye, Edit2, Trash2, LucideIcon } from "lucide-react";

interface EntityCardProps {
  icon: LucideIcon;
  iconClassName: string; // e.g., "bg-gradient-to-br from-emerald-500 to-teal-500"
  hoverBorderClassName: string; // e.g., "hover:border-emerald-600/30"
  title: string;
  subtitle?: string;
  description?: string;
  stats: Array<{
    icon: LucideIcon;
    value: number | string;
    label?: string;
  }>;
  date?: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EntityCard({
  icon: Icon,
  iconClassName,
  hoverBorderClassName,
  title,
  subtitle,
  description,
  stats,
  date,
  onView,
  onEdit,
  onDelete,
}: EntityCardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-xl p-6 ${hoverBorderClassName} transition-all group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 ${iconClassName} rounded-lg flex items-center justify-center`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {subtitle && (
              <p className="text-xs text-emerald-400 mt-0.5 font-mono">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="View details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {description && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div className="flex items-center gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-gray-400 text-sm"
            >
              <stat.icon size={14} />
              <span>
                {stat.value}
                {stat.label && ` ${stat.label}`}
              </span>
            </div>
          ))}
        </div>
        {date && (
          <p className="text-xs text-gray-500">
            {new Date(date).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
