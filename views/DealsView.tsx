import React, { useState } from 'react';
import PriorityDealCard from '../components/PriorityDealCard';
import DealFeedItem from '../components/DealFeedItem';
import { generateDeals } from '../constants';
import { Sparkles, CreditCard, X, ArrowRight, ExternalLink } from '../components/Icons';
import { UserProfile, Deal } from '../types';

interface DealsViewProps {
  userProfile: UserProfile;
}

type FilterType = 'ALL' | 'FLIGHT' | 'SPEND' | 'TRANSFER' | 'PARTNER';

const DealsView: React.FC<DealsViewProps> = ({ userProfile }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const deals = generateDeals(userProfile);
  const priorityDeal = deals.find(d => d.priority === 'HIGH') || deals[0];
  
  // Filter logic
  const feedDeals = deals.filter(d => {
    // Hide priority deal from feed unless filtered
    if (activeFilter === 'ALL' && d.id === priorityDeal?.id) return false;
    
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'FLIGHT') return d.type === 'FLIGHT' || d.type === 'STATUS';
    if (activeFilter === 'SPEND') return d.type === 'SPEND';
    if (activeFilter === 'TRANSFER') return d.type === 'TRANSFER';
    if (activeFilter === 'PARTNER') return d.type === 'PARTNER';
    return true;
  });

  const primaryAirlineName = userProfile.selectedAirlines[0]?.name || 'maximum value';

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto animate-fade-in relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Opportunities</h1>
        <p className="text-slate-400 text-sm">Sorted for {primaryAirlineName}.</p>
      </div>

      {/* Chip Filters */}
      <div className="flex overflow-x-auto no-scrollbar space-x-2 mb-6 pb-1">
         <FilterChip label="All" active={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} />
         <FilterChip label="Flights" active={activeFilter === 'FLIGHT'} onClick={() => setActiveFilter('FLIGHT')} />
         <FilterChip label="Cards" active={activeFilter === 'SPEND'} onClick={() => setActiveFilter('SPEND')} />
         <FilterChip label="Transfers" active={activeFilter === 'TRANSFER'} onClick={() => setActiveFilter('TRANSFER')} />
         <FilterChip label="Shopping" active={activeFilter === 'PARTNER'} onClick={() => setActiveFilter('PARTNER')} />
      </div>

      {activeFilter === 'ALL' && priorityDeal && (
          <div onClick={() => setSelectedDeal(priorityDeal)} className="cursor-pointer">
             <PriorityDealCard deal={priorityDeal} />
          </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-slate-200 text-lg">
            {activeFilter === 'ALL' ? 'Personalized Feed' : `${activeFilter.charAt(0) + activeFilter.slice(1).toLowerCase()} Deals`}
        </h3>
      </div>

      <div className="space-y-4">
        {feedDeals.map((deal) => (
          <div key={deal.id} onClick={() => setSelectedDeal(deal)}>
            <DealFeedItem deal={deal} />
          </div>
        ))}
        
        {feedDeals.length === 0 && (
            <div className="py-8 text-center text-slate-500">
                No deals found for this category.
            </div>
        )}
      </div>

      {/* Deal Details Modal */}
      {selectedDeal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                  <button 
                    onClick={() => setSelectedDeal(null)} 
                    className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full"
                  >
                      <X size={20} />
                  </button>
                  
                  <div className="mb-6">
                      <span className="text-xs font-bold bg-brand-900 text-brand-300 px-2 py-1 rounded uppercase tracking-wider">
                          {selectedDeal.type}
                      </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2 pr-8">{selectedDeal.title}</h2>
                  <p className="text-slate-400 mb-6 leading-relaxed">{selectedDeal.description}</p>

                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 mb-6">
                      <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-500 text-sm">Value</span>
                          <span className="text-emerald-400 font-bold text-lg">{selectedDeal.value}</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">Expires</span>
                          <span className="text-slate-300 font-medium">{selectedDeal.expiry}</span>
                      </div>
                  </div>

                  {selectedDeal.steps && (
                      <div className="mb-6">
                          <h3 className="font-bold text-slate-200 mb-3">How to get it</h3>
                          <div className="space-y-3">
                              {selectedDeal.steps.map((step, idx) => (
                                  <div key={idx} className="flex items-start">
                                      <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0 border border-slate-700">
                                          {idx + 1}
                                      </div>
                                      <p className="text-sm text-slate-300">{step}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  <button 
                      onClick={() => {
                          if (selectedDeal.link) {
                            window.open(selectedDeal.link, '_blank');
                          }
                      }}
                      className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-colors"
                  >
                      {selectedDeal.link ? 'Go to Offer' : 'View Details'} <ExternalLink size={18} className="ml-2" />
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

const FilterChip = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${active ? 'bg-white text-slate-900 border-white' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600'}`}
    >
        {label}
    </button>
);

export default DealsView;