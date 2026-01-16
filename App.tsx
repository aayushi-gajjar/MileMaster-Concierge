import React, { useState } from 'react';
import { 
  Sparkles, 
  Plane, 
  Wallet, 
  MessageSquare, 
  User,
  Settings,
  ChevronLeft
} from './components/Icons';
import { TabView, UserProfile } from './types';
import DealsView from './views/DealsView';
import AirlineView from './views/AirlineView';
import WalletView from './views/WalletView';
import AssistantView from './views/AssistantView';
import OnboardingView from './views/OnboardingView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('DEALS');
  const [showSettings, setShowSettings] = useState(false);
  
  // State for User Profile & Onboarding
  const [userProfile, setUserProfile] = useState<UserProfile>({
    selectedAirlines: [], // Changed from primaryAirline
    cards: [],
    loyaltyAccounts: [],
    partnerChannels: [],
    interestedInNewCardBonuses: false,
    onboardingComplete: false
  });

  // If onboarding is not complete, show onboarding flow
  if (!userProfile.onboardingComplete) {
    return <OnboardingView onComplete={setUserProfile} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'DEALS': return <DealsView userProfile={userProfile} />;
      case 'AIRLINE': return <AirlineView userProfile={userProfile} />;
      case 'WALLET': return <WalletView userProfile={userProfile} onUpdateProfile={setUserProfile} />;
      case 'ASSISTANT': return <AssistantView userProfile={userProfile} />;
      default: return <DealsView userProfile={userProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 relative">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-slate-800/50">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-sm mr-2">
            MM
          </div>
          <span className="font-semibold text-sm text-slate-300">Concierge Active</span>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <User size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto min-h-[calc(100vh-140px)]">
         {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950 border-t border-slate-800 px-6 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <NavButton 
            active={activeTab === 'DEALS'} 
            onClick={() => setActiveTab('DEALS')} 
            icon={<Sparkles size={22} />} 
            label="Deals" 
          />
          <NavButton 
            active={activeTab === 'AIRLINE'} 
            onClick={() => setActiveTab('AIRLINE')} 
            icon={<Plane size={22} />} 
            label="My Airline" 
          />
          <NavButton 
            active={activeTab === 'WALLET'} 
            onClick={() => setActiveTab('WALLET')} 
            icon={<Wallet size={22} />} 
            label="Wallet" 
          />
          <NavButton 
            active={activeTab === 'ASSISTANT'} 
            onClick={() => setActiveTab('ASSISTANT')} 
            icon={<MessageSquare size={22} />} 
            label="Concierge" 
          />
        </div>
      </div>

      {/* Settings Modal (Simplified) */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
           <div className="bg-slate-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 h-[80vh] overflow-y-auto border-t border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Preferences</h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Your Airlines</h3>
                  <div className="space-y-2">
                    {userProfile.selectedAirlines.map(airline => (
                        <div key={airline.id} className="p-4 border border-brand-500/30 bg-brand-500/10 rounded-xl flex justify-between items-center text-brand-200 font-medium">
                            <div className="flex items-center">
                                <span className="font-bold text-xs mr-2">{airline.code}</span>
                                <span>{airline.name}</span>
                            </div>
                            <span className="text-xs bg-brand-900 text-brand-300 px-2 py-1 rounded border border-brand-700">Tracked</span>
                        </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Notification Style</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 border border-slate-800 rounded-xl bg-slate-950/50">
                      <span className="text-slate-300">Deal Alerts</span>
                      <div className="w-10 h-6 bg-emerald-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </label>
                     <label className="flex items-center justify-between p-3 border border-slate-800 rounded-xl bg-slate-950/50">
                      <span className="text-slate-300">Quiet Hours</span>
                      <div className="w-10 h-6 bg-slate-700 rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </label>
                  </div>
                </section>
                
                 <div className="pt-4 text-center">
                    <button onClick={() => setShowSettings(false)} className="w-full py-3 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                        Save Changes
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 py-2 transition-all duration-300 ${active ? 'text-brand-400 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
  >
    <div className={`mb-1 transition-transform ${active ? '-translate-y-0.5' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-medium ${active ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
      {label}
    </span>
  </button>
);

export default App;