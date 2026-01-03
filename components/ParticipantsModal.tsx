
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { Event, User } from '../types';

interface ParticipantsModalProps {
  event: Event;
  onClose: () => void;
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({ event, onClose }) => {
  const [participants, setParticipants] = useState<(User & { registeredAt: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await dbService.getParticipants(event.id);
      setParticipants(data);
      setLoading(false);
    };
    fetch();
  }, [event.id]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-[#111] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Participants</h2>
            <p className="text-slate-400 text-sm">Reviewing attendees for <span className="text-indigo-400 font-bold">{event.title}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
            </div>
          ) : participants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Name</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</th>
                    <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right pr-2">Reg. Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {participants.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                            {p.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-white">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-slate-400 font-mono">{p.email}</td>
                      <td className="py-4 text-xs text-slate-500 text-right pr-2">
                        {new Date(p.registeredAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-slate-500 italic">No registrations for this pulse yet.</p>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-black/20 border-t border-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsModal;
