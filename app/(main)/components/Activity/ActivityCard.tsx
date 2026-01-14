import React from 'react';
import { IconType } from 'react-icons';

interface ActivityCardProps {
  icon: IconType;
  text: string;
  time: string;
}

export default function ActivityCard({ icon: Icon, text, time }: ActivityCardProps) {
  return (
    <div className="flex items-center px-5 py-4 w-full gap-4 transition-all duration-200 hover:bg-gray-50 border-b border-gray-100 last:border-none group">

      {/* აიქონის კონტეინერი - ანიჭებს ქარდს უფრო პროფესიონალურ იერს */}
      <div className="flex items-center justify-center p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
        <Icon size={22} />
      </div>

      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-medium text-gray-800 leading-tight">
          {text}
        </h2>
        <span className="text-gray-400 text-sm">
          {time} ago
        </span>
      </div>

    </div>
  );
}
