import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string | number;
  isCollapsed?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon: Icon,
  label,
  badge,
  isCollapsed = false,
}) => {
  return (
    <NavLink
      to={to}
      title={isCollapsed ? label : undefined}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl py-2.5 text-sm transition-all duration-200 ${
          isCollapsed ? "justify-center px-2" : "justify-between px-3.5"
        } ${
          isActive
            ? "bg-black/10 border border-white text-[#37352F] font-semibold shadow-xs backdrop-blur-md"
            : "border border-transparent text-[#787774] hover:bg-white/50 hover:text-[#37352F] font-medium"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}
          >
            <Icon
              className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                isActive
                  ? "text-[#37352F]"
                  : "text-[#787774] group-hover:text-[#37352F]"
              }`}
            />
            {!isCollapsed && <span className="truncate">{label}</span>}
          </div>

          {!isCollapsed && badge !== undefined && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                isActive
                  ? "bg-[#37352F] text-white"
                  : "bg-neutral-200/70 text-[#787774] group-hover:bg-neutral-200 group-hover:text-[#37352F]"
              }`}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
