import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles } from '../components/Icons';
import { SUGGESTED_PROMPTS } from '../constants';
import { sendMessageToGemini } from '../services/geminiService';
import { Message, UserProfile } from '../types';

interface AssistantViewProps {
  userProfile: UserProfile;
}

const AssistantView: React.FC<AssistantViewProps> = ({ userProfile }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const airlineNames = userProfile.selectedAirlines.map(a => a.name).join(' & ');
  const cardNames = userProfile.cards.length > 0 ? userProfile.cards[0].name : 'your cards';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `I'm analyzing ${airlineNames} routes and ${cardNames} multipliers. What's your next travel goal?`,
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyForApi = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
      }));
      
      const responseText = await sendMessageToGemini(text, userProfile, historyForApi);

      const newModelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I couldn't process that request right now.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newModelMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble connecting to the network. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-md mx-auto bg-slate-950 pb-20"> {/* Added pb-20 to lift content above nav */}
      
      {/* Header */}
      <div className="px-4 pt-6 pb-2 border-b border-slate-800/50">
          <h1 className="text-xl font-bold text-white flex items-center">
              <Sparkles className="text-brand-400 mr-2" size={20} />
              Concierge
          </h1>
          <p className="text-xs text-slate-400 mt-1">
              Ask me anything about miles, redeeming flights, or credit card strategy.
          </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-br-none'
                  : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-2 border border-slate-700">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 pt-2">
        {/* Suggested Prompts with Horizontal Scroll */}
        {messages.length < 3 && (
            <div className="flex overflow-x-auto space-x-2 mb-4 no-scrollbar pb-2">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap flex-shrink-0 bg-slate-900 border border-slate-800 text-slate-400 text-xs px-3 py-2 rounded-full hover:bg-slate-800 hover:text-slate-200 active:bg-slate-700 transition-colors"
                >
                {prompt}
                </button>
            ))}
            </div>
        )}

        <div className="relative flex items-center mb-4"> {/* Added mb-4 for breathing room */}
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask your deal master..."
            disabled={isLoading}
            className="w-full bg-slate-900 text-white placeholder-slate-500 rounded-full pl-5 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 border border-slate-800 transition-shadow shadow-lg"
            />
            <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bg-brand-600 text-white p-2 rounded-full hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
            <Send size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantView;