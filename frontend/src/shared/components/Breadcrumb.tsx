import React from "react";
import { Home, ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentClassName?: string;
}

export default function Breadcrumb({ items, currentClassName = "text-slate-900 font-medium not-italic" }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-700 py-1 font-medium">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <a href={item.href} className="hover:text-blue-600 transition flex items-center gap-1.5">
              {index === 0 && (
                <Home size={16} />
              )}
              {item.label}
            </a>
          ) : (
            <span className={currentClassName}>{item.label}</span>
          )}
          {index < items.length - 1 && (
            <ChevronRight size={16} className="text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
