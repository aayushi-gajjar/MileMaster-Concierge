import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { UserProfile, Airline } from '../types';
import { Plane, TrendingUp, CheckCircle, ArrowRight, MapPin, ExternalLink } from '../components/Icons';

interface AirlineViewProps {
  userProfile: UserProfile;
}

const AirlineView: React.FC<AirlineViewProps> = ({ userProfile }) => {
  // Logic to show all connected airlines or selected ones. 
  // If multiple airlines are connected/selected, we show cards for them.
  const airlines = userProfile.selectedAirlines.length > 0 
    ? userProfile.selectedAirlines 
    : [{ id: 'none', name: 'No Airline Selected', code: '--', color: '#334155' } as Airline];
  
  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto animate-fade-in">
      <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Command Center</h1>
          <p className="text-slate-400 text-sm">Your status across networks.</p>
      </div>

      {/* Horizontal Scroll for Airlines if multiple */}
      <div className="flex overflow-x-auto no-scrollbar space-x-4 mb-8 -mx-4 px-4 snap-x">
          {airlines.map(airline => {
             return <StatusCard key={airline.id} airline={airline} userProfile={userProfile} />;
          })}
      </div>

      {/* Best ways to earn */}
      <h3 className="font-bold text-slate-200 text-lg mb-4">Earning Boosters</h3>
      <div className="space-y-3 mb-8">
        
        {/* Dynamic Partner Channels */}
        {userProfile.partnerChannels.filter(p => p.enabled).map(partner => (
            <div key={partner.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors cursor-pointer group">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-900/30 text-emerald-500 flex items-center justify-center mr-3 group-hover:bg-emerald-900/50 transition-colors">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <div className="font-semibold text-sm text-slate-200">{partner.name}</div>
                        <div className="text-xs text-slate-500">Connected & Ready</div>
                    </div>
                </div>
                <button className="text-slate-600 hover:text-brand-400">
                    <ExternalLink size={20} />
                </button>
            </div>
        ))}

         <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors cursor-pointer group">
            <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-900/30 text-blue-500 flex items-center justify-center mr-3 group-hover:bg-blue-900/50 transition-colors">
                    <MapPin size={20} />
                </div>
                <div>
                    <div className="font-semibold text-sm text-slate-200">Route Watchlist</div>
                    <div className="text-xs text-slate-500">Track price drops for NYC &rarr; LHR</div>
                </div>
            </div>
            <button className="text-slate-600 hover:text-brand-400">
                <ExternalLink size={20} />
            </button>
        </div>
      </div>

       {/* Goal Tracker */}
       <div className="bg-brand-950 rounded-2xl p-6 text-white relative overflow-hidden border border-brand-900">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="relative z-10">
            <h3 className="font-bold mb-1 text-white flex items-center">
                <CheckCircle size={18} className="text-emerald-400 mr-2" />
                Reward Goal
            </h3>
            <p className="text-brand-200 text-sm mb-4">Business Class to Europe</p>
            
            <div className="mb-2 flex justify-between text-xs font-semibold">
                <span className="text-brand-400">142,500</span>
                <span className="text-white">180,000 pts</span>
            </div>
            <div className="w-full bg-brand-900 rounded-full h-2 mb-2">
                <div className="bg-emerald-400 h-2 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: '79%'}}></div>
            </div>
            <p className="text-xs text-brand-400 mt-2">You're 79% of the way there!</p>
          </div>
       </div>
    </div>
  );
};

const StatusCard = ({ airline, userProfile }: { airline: Airline, userProfile: UserProfile }) => {
    const loyalty = userProfile.loyaltyAccounts.find(l => l.programName === airline.name);
    
    // Create some fake variation based on airline name length so cards look different
    const seed = airline.name.length;
    const isConnected = loyalty && loyalty.connected;
    
    // Mock Data
    const milesBalance = isConnected ? (seed * 12450) + 25000 : 0;
    const statusLevel = isConnected ? (seed % 2 === 0 ? 'Gold' : 'Platinum') : 'Member';
    const nextStatusProgress = isConnected ? (seed * 7) % 100 : 0;
  
    // Data for the radial progress chart
    const data = [
      { name: 'Completed', value: nextStatusProgress },
      { name: 'Remaining', value: 100 - nextStatusProgress },
    ];
    const COLORS = ['#0ea5e9', '#1e293b']; // brand-500, slate-800

    return (
      <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden min-w-[85%] sm:min-w-full snap-center flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
             <div className="flex items-center">
                 <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold mr-3 bg-white overflow-hidden shadow-sm">
                    {airline.logo ? (
                        <img src={airline.logo} alt={airline.code} className="w-full h-full object-contain p-0.5" referrerPolicy="no-referrer" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white" style={{ backgroundColor: airline.color }}>
                            {airline.code}
                        </div>
                    )}
                </div>
                <span className="font-bold text-slate-200">{airline.name}</span>
             </div>
             {isConnected ? (
                 <div className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Connected
                 </div>
            ) : (
                <div className="text-[10px] font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    Guest
                 </div>
            )}
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-sm text-slate-400 mb-1">Miles Balance</div>
            <div className="text-3xl font-black text-white tracking-tight">
              {milesBalance.toLocaleString()}
            </div>
          </div>
          <div className="w-16 h-16 relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={22}
                    outerRadius={28}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-500">
                {nextStatusProgress}%
              </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4">
           <div className="flex justify-between text-sm mb-2">
             <span className="text-slate-500">Current Status</span>
             <span className="font-bold text-slate-300">{statusLevel}</span>
           </div>
           <div className="w-full bg-slate-800 rounded-full h-2 mb-1">
             <div className="bg-brand-600 h-2 rounded-full" style={{ width: `${nextStatusProgress}%`}}></div>
           </div>
           <div className="text-xs text-slate-500 text-right">Target: {statusLevel === 'Gold' ? 'Platinum' : 'Diamond'}</div>
        </div>
      </div>
    );
};

export default AirlineView;