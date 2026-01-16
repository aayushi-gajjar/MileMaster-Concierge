import React from 'react';
import { Deal } from '../types';
import { Clock, ArrowRight } from './Icons';

interface PriorityDealCardProps {
  deal: Deal;
}

const PriorityDealCard: React.FC<PriorityDealCardProps> = ({ deal }) => {
  return (
    <div className="w-full bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden mb-8">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-indigo-500/30 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider text-indigo-100 border border-indigo-400/20">
            Top Priority
          </span>
          <div className="flex items-center text-slate-400 text-sm">
            <Clock size={14} className="mr-1" />
            {deal.expiry}
          </div>
        </div>

        <h2 className="text-2xl font-bold leading-tight mb-2 text-white">
          {deal.title}
        </h2>
        
        <p className="text-slate-300 mb-6 text-sm leading-relaxed max-w-[90%]">
          {deal.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Impact</div>
            <div className="text-xl font-bold text-emerald-400">{deal.value}</div>
          </div>
          
          <button className="bg-white text-slate-900 px-5 py-3 rounded-xl font-semibold text-sm flex items-center hover:bg-slate-200 transition-colors active:scale-95">
            Show me how
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriorityDealCard;