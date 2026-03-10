import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { ActionButtons } from "./ActionButtons";

interface EntityCardProps {
  icon?: LucideIcon;
  displayNumber?: number; // Sequential number to display instead of icon
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
  displayNumber,
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
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className={`w-10 h-10 ${iconClassName} rounded-lg flex items-center justify-center flex-shrink-0`}
          >
            {displayNumber !== undefined ? (
              <span className="text-white font-bold text-lg">
                {displayNumber}
              </span>
            ) : (
              Icon && <Icon className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-white leading-tight break-words">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-emerald-400 mt-1 font-mono">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <ActionButtons
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          iconSize={16}
        />
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
