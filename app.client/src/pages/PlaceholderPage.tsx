import React from 'react';
import { Library } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-slate-800 rounded-lg mx-auto flex items-center justify-center">
          <Library className="text-slate-500" size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="text-slate-400">Coming soon</p>
        </div>
      </div>
    </div>
  );
};