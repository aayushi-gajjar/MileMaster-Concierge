import React, { useState } from 'react';
import { UserProfile, CreditCard, LoyaltyAccount } from '../types';
import { CreditCard as CardIcon, Plus, X, Check, Edit2 } from '../components/Icons';
import { CREDIT_CARDS_LIST } from '../constants';

interface WalletViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const WalletView: React.FC<WalletViewProps> = ({ userProfile, onUpdateProfile }) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardSearch, setCardSearch] = useState('');
  
  const [editingLoyalty, setEditingLoyalty] = useState<LoyaltyAccount | null>(null);
  const [newLoyaltyNumber, setNewLoyaltyNumber] = useState('');

  const filteredCards = CREDIT_CARDS_LIST.filter(c => 
    !userProfile.cards.find(existing => existing.id === c.id) &&
    (c.name.toLowerCase().includes(cardSearch.toLowerCase()) || 
     c.issuer.toLowerCase().includes(cardSearch.toLowerCase()))
  );

  const handleAddCard = (card: CreditCard) => {
    onUpdateProfile({
        ...userProfile,
        cards: [...userProfile.cards, card]
    });
    setShowAddCard(false);
    setCardSearch('');
  };

  const handleUpdateLoyalty = () => {
      if (!editingLoyalty) return;
      const updatedAccounts = userProfile.loyaltyAccounts.map(acc => 
          acc.programName === editingLoyalty.programName 
          ? { ...acc, membershipNumber: newLoyaltyNumber } 
          : acc
      );
      onUpdateProfile({
          ...userProfile,
          loyaltyAccounts: updatedAccounts
      });
      setEditingLoyalty(null);
      setNewLoyaltyNumber('');
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto animate-fade-in relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
        <p className="text-slate-400 text-sm">Your earning engine.</p>
      </div>

      <div className="grid gap-4 mb-8">
        {userProfile.cards.length > 0 ? userProfile.cards.map((card) => (
          <div key={card.id} className="bg-slate-900 rounded-xl p-5 shadow-lg border border-slate-800 relative overflow-hidden group">
            <div className="flex items-center mb-4">
                <div className="w-10 h-6 bg-slate-700 rounded mr-3 relative overflow-hidden border border-slate-600">
                    <div className="absolute top-2 left-0 w-full h-1 bg-white/10"></div>
                </div>
                <div>
                    <h3 className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{card.name}</h3>
                    <p className="text-xs text-slate-500">{card.network}</p>
                </div>
            </div>
            
            <div className="space-y-3">
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700/50">
                    <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">Best Use</div>
                    <div className="text-sm font-semibold text-brand-400">{card.bestUse}</div>
                </div>
            </div>
          </div>
        )) : (
            <div className="text-center py-8 bg-slate-900 rounded-xl border border-slate-800 border-dashed">
                <p className="text-slate-500 text-sm mb-4">No cards added yet.</p>
                <button 
                    onClick={() => setShowAddCard(true)}
                    className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                >
                    + Add Card
                </button>
            </div>
        )}
        
        {userProfile.cards.length > 0 && (
            <button 
                onClick={() => setShowAddCard(true)}
                className="flex items-center justify-center p-4 border border-slate-800 border-dashed rounded-xl text-slate-500 hover:bg-slate-900 hover:text-slate-300 transition-colors"
            >
                <Plus size={20} className="mr-2" />
                <span className="text-sm font-semibold">Add another card</span>
            </button>
        )}
      </div>

      <h3 className="font-bold text-slate-200 text-lg mb-4">Point Sources</h3>
      <div className="space-y-2">
         {userProfile.loyaltyAccounts.map((account, idx) => (
             <div key={idx} className="bg-slate-900 p-4 rounded-xl flex justify-between items-center border border-slate-800">
                 <div>
                    <div className="font-semibold text-slate-200">{account.programName}</div>
                    <div className="text-xs text-slate-500 flex items-center">
                        {account.membershipNumber}
                        <div className="w-1 h-1 bg-slate-600 rounded-full mx-2"></div>
                        <span className="text-emerald-500">Connected</span>
                    </div>
                 </div>
                 <button 
                    onClick={() => {
                        setEditingLoyalty(account);
                        setNewLoyaltyNumber(account.membershipNumber || '');
                    }}
                    className="p-2 text-slate-600 hover:text-brand-400 bg-slate-800/50 rounded-lg"
                 >
                    <Edit2 size={16} />
                 </button>
             </div>
         ))}
         {userProfile.loyaltyAccounts.length === 0 && (
             <p className="text-slate-500 text-sm">No loyalty accounts linked.</p>
         )}
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
           <div className="bg-slate-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 border-t border-slate-800">
               <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Add Card</h2>
                    <button onClick={() => setShowAddCard(false)} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white"><X size={20} /></button>
               </div>
               
               <input 
                  type="text"
                  placeholder="Search cards..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-white mb-4"
                  value={cardSearch}
                  onChange={(e) => setCardSearch(e.target.value)}
                  autoFocus
                />
                
                <div className="max-h-60 overflow-y-auto space-y-2 no-scrollbar">
                    {filteredCards.length > 0 ? filteredCards.map(card => (
                        <button 
                            key={card.id}
                            onClick={() => handleAddCard(card)}
                            className="w-full text-left px-4 py-3 text-sm bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300 flex justify-between items-center"
                        >
                            <span><span className="font-bold text-white">{card.issuer}</span> {card.name}</span>
                            <Plus size={16} />
                        </button>
                    )) : (
                        <p className="text-slate-500 text-sm text-center py-4">No matching cards found</p>
                    )}
                </div>
           </div>
        </div>
      )}

      {/* Edit Loyalty Modal */}
      {editingLoyalty && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
           <div className="bg-slate-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 border-t border-slate-800">
               <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Update Account</h2>
                    <button onClick={() => setEditingLoyalty(null)} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white"><X size={20} /></button>
               </div>
               
               <div className="mb-4">
                   <label className="text-xs text-slate-500 mb-1 block">Program</label>
                   <div className="font-bold text-white text-lg">{editingLoyalty.programName}</div>
               </div>

               <div className="mb-6">
                   <label className="text-xs text-slate-500 mb-1 block">Membership Number</label>
                   <input 
                       type="text"
                       value={newLoyaltyNumber}
                       onChange={(e) => setNewLoyaltyNumber(e.target.value)}
                       className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                       autoFocus
                   />
               </div>

               <button 
                  onClick={handleUpdateLoyalty}
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl transition-colors"
               >
                  Save Changes
               </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default WalletView;