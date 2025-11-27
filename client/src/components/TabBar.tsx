import React from 'react';
import { PaperSection, SectionId } from '../types';

type TabBarProps = {
  sections: PaperSection[];
  activeId: SectionId;
  onSelect: (id: SectionId) => void;
};

const TabBar: React.FC<TabBarProps> = ({ sections, activeId, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSelect(section.id)}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            section.id === activeId
              ? 'bg-blue-600 text-white shadow'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {section.label}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
