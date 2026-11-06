import React from "react";
import { Home, ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentClassName?: string;
  className?: string;
}

export default function Breadcrumb({ 
  items, 
  currentClassName = "text-slate-900 font-medium not-italic",
  className = ""
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-700 py-1 font-medium whitespace-nowrap overflow-x-auto no-scrollbar ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <a href={item.href} className="hover:text-blue-600 transition flex items-center gap-1 sm:gap-1.5 shrink-0 whitespace-nowrap">
              {index === 0 && (
                <Home size={14} className="shrink-0" />
              )}
              <span className="shrink-0">{item.label}</span>
            </a>
          ) : (
            <span className={`${currentClassName} shrink-0 whitespace-nowrap`}>{item.label}</span>
          )}
          {index < items.length - 1 && (
            <ChevronRight size={14} className="text-gray-400 shrink-0" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
