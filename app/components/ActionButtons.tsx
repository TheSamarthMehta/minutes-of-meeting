import { Eye, Edit2, Trash2, LucideIcon } from "lucide-react";

interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void;
  icon: "view" | "edit" | "delete";
  size?: number;
  className?: string;
}

interface ActionButtonsGroupProps {
  onView?: (e: React.MouseEvent) => void;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  iconSize?: number;
  showLabels?: boolean;
}

// Icon button color configurations
const ICON_STYLES = {
  view: {
    color: "text-emerald-400",
    hoverBg: "hover:bg-emerald-500/10",
    Icon: Eye,
  },
  edit: {
    color: "text-blue-400",
    hoverBg: "hover:bg-blue-500/10",
    Icon: Edit2,
  },
  delete: {
    color: "text-red-400",
    hoverBg: "hover:bg-red-500/10",
    Icon: Trash2,
  },
} as const;

/**
 * Single action button with consistent styling
 */
export function ActionButton({
  onClick,
  icon,
  size = 18,
  className = "",
}: ActionButtonProps) {
  const { color, hoverBg, Icon } = ICON_STYLES[icon];

  return (
    <button
      onClick={onClick}
      className={`p-2 ${color} ${hoverBg} rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${className}`}
      aria-label={icon}
    >
      <Icon size={size} />
    </button>
  );
}

/**
 * Group of action buttons with consistent styling
 * Shows only the buttons that have handlers provided
 */
export function ActionButtons({
  onView,
  onEdit,
  onDelete,
  iconSize = 18,
  showLabels = false,
}: ActionButtonsGroupProps) {
  return (
    <div className="flex gap-2">
      {onView && (
        <button
          onClick={onView}
          className={`p-2 ${ICON_STYLES.view.color} ${ICON_STYLES.view.hoverBg} rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${showLabels ? "flex items-center gap-1" : ""}`}
          aria-label="View"
        >
          <ICON_STYLES.view.Icon size={iconSize} />
          {showLabels && <span className="text-xs">View</span>}
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className={`p-2 ${ICON_STYLES.edit.color} ${ICON_STYLES.edit.hoverBg} rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${showLabels ? "flex items-center gap-1" : ""}`}
          aria-label="Edit"
        >
          <ICON_STYLES.edit.Icon size={iconSize} />
          {showLabels && <span className="text-xs">Edit</span>}
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className={`p-2 ${ICON_STYLES.delete.color} ${ICON_STYLES.delete.hoverBg} rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${showLabels ? "flex items-center gap-1" : ""}`}
          aria-label="Delete"
        >
          <ICON_STYLES.delete.Icon size={iconSize} />
          {showLabels && <span className="text-xs">Delete</span>}
        </button>
      )}
    </div>
  );
}

// Export the icon styles for use in other components if needed
export { ICON_STYLES };
