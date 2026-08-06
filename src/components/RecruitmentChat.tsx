import React, { useState } from 'react';
import { Send, ShieldCheck, Lock, User, MessageSquare } from 'lucide-react';
import { Message } from '../types';
import { motion } from 'motion/react';

interface RecruitmentChatProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLocked: boolean;
  recipientName: string;
}

export default function RecruitmentChat({ messages, onSendMessage, isLocked, recipientName }: RecruitmentChatProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[400px] bg-surface border border-surface-hover overflow-hidden">
      <div className="p-4 border-b border-surface-hover bg-surface-section flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-full">
            <MessageSquare size={16} />
          </div>
          <div>
            <span className="block text-xs font-black uppercase tracking-widest leading-none mb-1">{recipientName}</span>
            <div className="flex items-center gap-1">
              {isLocked ? (
                <>
                  <ShieldCheck size={10} className="text-success" />
                  <span className="text-[8px] font-bold text-success uppercase tracking-tighter">Flux Sécurisé & Tracé</span>
                </>
              ) : (
                <>
                  <Lock size={10} className="text-warning" />
                  <span className="text-[8px] font-bold text-warning uppercase tracking-tighter">Attente de Verrouillage</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 grayscale">
            <Lock size={32} className="mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest max-w-[200px]">
              Envoyez le premier message pour verrouiller ce recrutement sur la plateforme.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex ${msg.senderType === 'recruiter' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 ${
                msg.senderType === 'recruiter' 
                  ? 'bg-primary text-surface rounded-l-lg rounded-tr-lg' 
                  : 'bg-surface-section text-text-main rounded-r-lg rounded-tl-lg border border-surface-hover'
              }`}>
                <p className="text-xs font-medium leading-relaxed">{msg.content}</p>
                <span className="block text-[8px] mt-1 opacity-50 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-surface-hover bg-surface-section">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écrivez votre message sécurisé..."
            className="flex-1 bg-surface border border-surface-hover px-4 py-2 text-xs font-bold focus:outline-none focus:border-primary transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 bg-primary text-surface hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:grayscale"
          >
            <Send size={18} />
          </button>
        </div>
        {!isLocked && (
          <p className="text-[8px] font-bold text-warning uppercase mt-2 flex items-center gap-1">
            <ShieldCheck size={10} /> Le premier message active l'attribution forcée.
          </p>
        )}
      </div>
    </div>
  );
}
