
import React from 'react';
import { Recommendation } from '../types';

interface RecommendationCardProps {
  rec: Recommendation;
  isSelected: boolean;
  onSelect: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ rec, isSelected, onSelect }) => {
  return (
    <div 
      onClick={onSelect}
      className={`group relative p-6 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
        isSelected 
        ? 'glass ring-2 ring-indigo-500 bg-opacity-10 translate-y-[-4px]' 
        : 'glass hover:bg-opacity-5 hover:translate-y-[-2px]'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{rec.icon}</div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
          rec.category === 'Food' ? 'bg-orange-500/20 text-orange-400' :
          rec.category === 'Media' ? 'bg-purple-500/20 text-purple-400' :
          'bg-emerald-500/20 text-emerald-400'
        }`}>
          {rec.category}
        </span>
      </div>
      
      <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors">
        {rec.title}
      </h3>
      
      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
        {rec.description}
      </p>

      <div className="mt-auto border-t border-white/5 pt-4">
        <p className="text-[11px] italic text-gray-500">
          "Because {rec.reasoning.charAt(0).toLowerCase() + rec.reasoning.slice(1)}"
        </p>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-indigo-500 rounded-full">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
