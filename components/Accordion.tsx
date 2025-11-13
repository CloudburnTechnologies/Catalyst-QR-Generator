
import React, { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  isOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ title, icon, children, isOpen = false }) => {
  const [isPaneOpen, setIsPaneOpen] = useState(isOpen);

  return (
    <div className="border-b border-gray-700">
      <button
        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-800/50 transition-colors"
        onClick={() => setIsPaneOpen(!isPaneOpen)}
      >
        <div className="flex items-center gap-3">
          <span className="text-indigo-400">{icon}</span>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        {isPaneOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isPaneOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
