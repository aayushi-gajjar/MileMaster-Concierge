import React from 'react';
import { Deal } from '../types';
import { TrendingUp, Clock, ChevronRight } from './Icons';

interface DealFeedItemProps {
  deal: Deal;
}

const DealFeedItem: React.FC<DealFeedItemProps> = ({ deal }) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-800 mb-4 hover:border-slate-700 transition-all cursor-pointer active:scale-[0.99]">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300 border border-slate-700">
            {deal.airline}
          </div>
          <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {deal.type}
          </span>
        </div>
        <div className="text-emerald-400 font-bold text-sm">
          {deal.value}
        </div>
      </div>

      <h3 className="font-bold text-slate-100 mb-1">{deal.title}</h3>
      <p className="text-sm text-slate-400 mb-4 line-clamp-2">{deal.description}</p>

      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-3">
        <div className="flex items-center">
          <Clock size={12} className="mr-1" />
          {deal.expiry}
        </div>
        <div className="flex items-center text-brand-400 font-medium group">
          Details <ChevronRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default DealFeedItem;