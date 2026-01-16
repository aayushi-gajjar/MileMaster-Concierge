import React, { useState } from 'react';
import { UserProfile, Airline, CreditCard, PartnerChannel, LoyaltyAccount } from '../types';
import { AIRLINES_LIST, CREDIT_CARDS_LIST, PARTNER_CHANNELS_LIST } from '../constants';
import { CheckCircle, Search, Plus, X, ArrowRight, ChevronRight, Check, ChevronLeft } from '../components/Icons';

interface OnboardingViewProps {
  onComplete: (profile: UserProfile) => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  // Changed to array for multiple selection
  const [selectedAirlines, setSelectedAirlines] = useState<Airline[]>([]);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loyaltyAccounts, setLoyaltyAccounts] = useState<LoyaltyAccount[]>([]);
  const [partnerChannels, setPartnerChannels] = useState<PartnerChannel[]>(PARTNER_CHANNELS_LIST);
  const [interestedInNewCardBonuses, setInterestedInNewCardBonuses] = useState(false);
  
  // Search states
  const [airlineSearch, setAirlineSearch] = useState('');
  const [cardSearch, setCardSearch] = useState('');
  
  // Loyalty Connection State
  const [connectingLoyalty, setConnectingLoyalty] = useState<string | null>(null); // airline ID being connected
  const [loyaltyNumberInput, setLoyaltyNumberInput] = useState('');
  const [connectSuccess, setConnectSuccess] = useState<string | null>(null);

  const handleFinish = () => {
    onComplete({
      selectedAirlines,
      cards,
      loyaltyAccounts,
      partnerChannels,
      interestedInNewCardBonuses,
      onboardingComplete: true
    });
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleAirline = (airline: Airline) => {
    if (selectedAirlines.find(a => a.id === airline.id)) {
      setSelectedAirlines(selectedAirlines.filter(a => a.id !== airline.id));
    } else {
      setSelectedAirlines([...selectedAirlines, airline]);
    }
  };

  const filteredAirlines = AIRLINES_LIST.filter(a => 
    a.name.toLowerCase().includes(airlineSearch.toLowerCase()) || 
    a.code.toLowerCase().includes(airlineSearch.toLowerCase())
  );

  const filteredCards = CREDIT_CARDS_LIST.filter(c => 
    !cards.find(existing => existing.id === c.id) &&
    (c.name.toLowerCase().includes(cardSearch.toLowerCase()) || 
     c.issuer.toLowerCase().includes(cardSearch.toLowerCase()))
  );

  const handleConnectLoyalty = (airline: Airline) => {
    setLoyaltyAccounts(prev => {
        // Remove existing if updating
        const filtered = prev.filter(l => l.programName !== airline.name);
        return [...filtered, { 
            programName: airline.name, 
            membershipNumber: loyaltyNumberInput,
            connected: true 
        }];
    });
    setConnectSuccess(airline.id);
    setTimeout(() => {
      setConnectingLoyalty(null);
      setConnectSuccess(null);
      setLoyaltyNumberInput('');
    }, 1500);
  };

  // --- Step 1: Pick Airlines (Multi-Select) ---
  if (step === 1) {
    return (
      <div className="max-w-md mx-auto h-screen flex flex-col p-6 bg-slate-950 text-white">
        <div className="w-full bg-slate-800 h-1 rounded-full mb-8">
          <div className="bg-brand-500 h-1 rounded-full w-1/4 transition-all duration-500"></div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Pick your airlines</h1>
        <p className="text-slate-400 mb-6">Select all the airlines you fly often.</p>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-slate-500" size={20} />
          <input 
            type="text"
            placeholder="Search airline (e.g. Qantas, Singapore)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-slate-600"
            value={airlineSearch}
            onChange={(e) => setAirlineSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
          {filteredAirlines.map(airline => {
            const isSelected = !!selectedAirlines.find(a => a.id === airline.id);
            return (
                <button
                key={airline.id}
                onClick={() => toggleAirline(airline)}
                className={`w-full flex items-center p-4 rounded-xl border transition-all text-left group ${isSelected ? 'border-brand-500 bg-brand-900/20' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}
                >
                <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mr-4 shadow-lg bg-white overflow-hidden shrink-0"
                >
                    {airline.logo ? (
                    <img 
                        src={airline.logo} 
                        alt={airline.code} 
                        className="w-full h-full object-contain p-1" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            // Fallback if image fails
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.style.backgroundColor = airline.color || '#333';
                            (e.target as HTMLImageElement).parentElement!.innerHTML = `<span style="color:white">${airline.code}</span>`;
                        }}
                    />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center text-white" style={{ backgroundColor: airline.color || '#334155' }}>
                        {airline.code}
                    </div>
                    )}
                </div>
                <span className={`font-semibold ${isSelected ? 'text-brand-100' : 'text-slate-200'}`}>{airline.name}</span>
                {isSelected ? (
                    <CheckCircle className="ml-auto text-brand-500" size={20} />
                ) : (
                    <div className="ml-auto w-5 h-5 rounded-full border border-slate-600"></div>
                )}
                </button>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-800">
             <button 
                onClick={() => setStep(2)} 
                disabled={selectedAirlines.length === 0}
                className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center transition-colors"
             >
                Continue ({selectedAirlines.length})
            </button>
        </div>
      </div>
    );
  }

  // --- Step 2: Add Assets & Connect Memberships ---
  if (step === 2) {
    return (
      <div className="max-w-md mx-auto h-screen flex flex-col p-6 bg-slate-950 text-white">
         <div className="flex items-center mb-6">
            <button onClick={goBack} className="p-2 -ml-2 text-slate-400 hover:text-white"><ChevronLeft /></button>
            <div className="flex-1 ml-2">
                <div className="w-full bg-slate-800 h-1 rounded-full">
                    <div className="bg-brand-500 h-1 rounded-full w-2/4 transition-all duration-500"></div>
                </div>
            </div>
         </div>

        <h1 className="text-2xl font-bold mb-2">Connect your wallet</h1>
        <p className="text-slate-400 mb-6">Link cards and loyalty accounts.</p>

        {/* Loyalty Section */}
        <div className="mb-8">
          <label className="text-sm font-bold text-slate-200 mb-3 block">Frequent Flyer Accounts</label>
          
          {/* List of Selected Airlines to Connect */}
          <div className="space-y-3 mb-3">
             {selectedAirlines.map(airline => {
                 const isConnected = !!loyaltyAccounts.find(l => l.programName === airline.name);
                 return (
                    <div key={airline.id} className={`bg-slate-900 border rounded-xl p-4 ${isConnected ? 'border-emerald-900/50 bg-emerald-900/10' : 'border-slate-800'}`}>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold mr-3 bg-white overflow-hidden shrink-0">
                               {airline.logo ? (
                                  <img src={airline.logo} alt={airline.code} className="w-full h-full object-contain p-0.5" referrerPolicy="no-referrer" />
                               ) : (
                                  <div className="w-full h-full flex items-center justify-center text-white" style={{ backgroundColor: airline.color }}>
                                     {airline.code}
                                  </div>
                               )}
                            </div>
                            <div>
                                <div className="font-semibold text-sm">{airline.name}</div>
                                {isConnected ? (
                                    <div className="text-xs text-emerald-500">Connected</div>
                                ) : (
                                    <div className="text-xs text-slate-500">Not connected</div>
                                )}
                            </div>
                         </div>
                         <button 
                             onClick={() => setConnectingLoyalty(airline.id)}
                             className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${isConnected ? 'text-emerald-500 bg-emerald-500/10' : 'bg-brand-600 hover:bg-brand-500 text-white'}`}
                         >
                             {isConnected ? 'Update' : 'Connect'}
                         </button>
                      </div>
                    </div>
                 );
             })}
          </div>
        </div>

        {/* Cards Section */}
        <div className="mb-auto">
          <label className="text-sm font-bold text-slate-200 mb-3 block">Credit Cards</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {cards.map(card => (
              <span key={card.id} className="inline-flex items-center bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                {card.issuer} {card.name}
                <button onClick={() => setCards(cards.filter(c => c.id !== card.id))} className="ml-2 text-slate-500 hover:text-slate-300">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          
          <div className="relative group mb-4">
             <input 
              type="text"
              placeholder="Search cards (e.g. Westpac, ANZ)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-white placeholder-slate-600"
              value={cardSearch}
              onChange={(e) => setCardSearch(e.target.value)}
            />
            {cardSearch && (
              <div className="absolute top-full left-0 right-0 bg-slate-900 border border-slate-700 shadow-xl rounded-xl mt-1 z-20 max-h-40 overflow-y-auto">
                 {filteredCards.length > 0 ? filteredCards.map(card => (
                   <button 
                    key={card.id}
                    onClick={() => {
                      setCards([...cards, card]);
                      setCardSearch('');
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-slate-800 border-b border-slate-800 last:border-0 text-slate-300"
                   >
                     <span className="font-bold text-white">{card.issuer}</span> {card.name}
                   </button>
                 )) : (
                   <div className="px-4 py-3 text-xs text-slate-500">No matching cards found</div>
                 )}
              </div>
            )}
          </div>

          {/* New Card Bonus Toggle */}
          <div className="flex items-start bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div 
                className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors mt-0.5 ${interestedInNewCardBonuses ? 'bg-brand-600' : 'bg-slate-700'}`}
                onClick={() => setInterestedInNewCardBonuses(!interestedInNewCardBonuses)}
            >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${interestedInNewCardBonuses ? 'translate-x-4' : ''}`}></div>
            </div>
            <div className="ml-3 cursor-pointer" onClick={() => setInterestedInNewCardBonuses(!interestedInNewCardBonuses)}>
                <div className="text-sm font-semibold text-slate-200">Show me new card bonuses</div>
                <div className="text-xs text-slate-500">Alert me when banks offer big sign-up points.</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
           <button onClick={() => setStep(3)} className="text-slate-500 text-sm font-medium hover:text-slate-300">Skip</button>
           <button 
             onClick={() => setStep(3)}
             className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-colors"
            >
             Next <ArrowRight size={18} className="ml-2" />
           </button>
        </div>

        {/* Modal for Loyalty Connection */}
        {(connectingLoyalty || connectingLoyalty === 'search') && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Enter Details</h3>
                        <button onClick={() => setConnectingLoyalty(null)}><X size={20} className="text-slate-500" /></button>
                    </div>
                    
                    {connectSuccess ? (
                        <div className="py-8 text-center flex flex-col items-center animate-fade-in">
                            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                                <Check size={32} />
                            </div>
                            <h4 className="font-bold text-emerald-400">Connected!</h4>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label className="text-xs text-slate-500 mb-1 block">Airline</label>
                                <div className="font-medium text-slate-200">
                                    {AIRLINES_LIST.find(a => a.id === connectingLoyalty)?.name}
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="text-xs text-slate-500 mb-1 block">Membership Number</label>
                                <input 
                                    type="text" 
                                    autoFocus
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                                    placeholder="e.g. 123456789"
                                    value={loyaltyNumberInput}
                                    onChange={(e) => setLoyaltyNumberInput(e.target.value)}
                                />
                            </div>
                            <button 
                                disabled={!loyaltyNumberInput}
                                onClick={() => {
                                    const airline = AIRLINES_LIST.find(a => a.id === connectingLoyalty);
                                    if (airline) handleConnectLoyalty(airline);
                                }}
                                className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                Save Account
                            </button>
                        </>
                    )}
                </div>
            </div>
        )}
      </div>
    );
  }

  // --- Step 3: Partner Channels ---
  if (step === 3) {
    return (
      <div className="max-w-md mx-auto h-screen flex flex-col p-6 bg-slate-950 text-white">
        <div className="flex items-center mb-6">
            <button onClick={goBack} className="p-2 -ml-2 text-slate-400 hover:text-white"><ChevronLeft /></button>
            <div className="flex-1 ml-2">
                <div className="w-full bg-slate-800 h-1 rounded-full">
                    <div className="bg-brand-500 h-1 rounded-full w-3/4 transition-all duration-500"></div>
                </div>
            </div>
         </div>

        <h1 className="text-2xl font-bold mb-2">Want extra miles?</h1>
        <p className="text-slate-400 mb-6">Start shopping through these to earn bonus miles.</p>

        <div className="flex-1 space-y-3">
          {partnerChannels.map(channel => (
             <div key={channel.id} className="flex items-center justify-between p-4 border border-slate-800 rounded-xl bg-slate-900">
                <div>
                   <div className="font-semibold text-slate-200">{channel.name}</div>
                   <div className="text-xs text-slate-500">{channel.type}</div>
                </div>
                <button 
                  onClick={() => {
                     const updated = partnerChannels.map(p => 
                        p.id === channel.id ? { ...p, enabled: !p.enabled } : p
                     );
                     setPartnerChannels(updated);
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative ${channel.enabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                   <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${channel.enabled ? 'left-6' : 'left-1'}`}></div>
                </button>
             </div>
          ))}
        </div>

        <div className="mt-6">
           <button 
             onClick={() => setStep(4)}
             className="w-full bg-white text-slate-950 py-4 rounded-xl font-bold flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
             Continue
           </button>
        </div>
      </div>
    );
  }

  // --- Step 4: Finish ---
  if (step === 4) {
    return (
      <div className="max-w-md mx-auto h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-center text-white">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-6 animate-bounce">
            <Check size={40} />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">All set!</h1>
        <p className="text-slate-400 mb-10 max-w-xs">
          We've built your personal deal feed based on your choices.
        </p>

        <div className="w-full max-w-xs space-y-4 mb-10 text-left">
           <div className="flex justify-between items-center p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-sm text-slate-500">Airlines</span>
              <span className="font-bold text-slate-200 truncate ml-4">
                 {selectedAirlines.length > 0 ? selectedAirlines.map(a => a.code).join(', ') : 'Flexible'}
              </span>
           </div>
           
           {/* Only show if items exist */}
           {(cards.length > 0 || loyaltyAccounts.length > 0) ? (
             <div className="flex justify-between items-center p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-sm text-slate-500">Wallet</span>
                <span className="font-bold text-slate-200">
                    {cards.length > 0 && `${cards.length} Cards`}
                    {cards.length > 0 && loyaltyAccounts.length > 0 && ', '}
                    {loyaltyAccounts.length > 0 && `${loyaltyAccounts.length} Linked`}
                </span>
             </div>
           ) : (
             <div className="flex justify-between items-center p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-sm text-slate-500">Wallet</span>
                <span className="font-bold text-slate-400 text-xs">No accounts linked</span>
             </div>
           )}

           {interestedInNewCardBonuses && (
               <div className="flex justify-between items-center p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-sm text-slate-500">Preferences</span>
                  <span className="font-bold text-slate-200 text-xs">Tracking Bonuses</span>
               </div>
           )}
        </div>

        <button 
            onClick={handleFinish}
            className="w-full max-w-xs bg-brand-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-900/50 hover:bg-brand-500 transition-all active:scale-95"
        >
            Show my deals
        </button>
        <button onClick={goBack} className="mt-4 text-slate-500 text-sm hover:text-slate-300">Go back</button>
      </div>
    );
  }

  return null;
};

export default OnboardingView;