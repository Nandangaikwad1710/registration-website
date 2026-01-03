
import React from 'react';
import { Event, UserRole } from '../types';

interface EventCardProps {
  event: Event;
  isRegistered: boolean;
  onRegister: () => void;
  onDelete?: () => void;
  onViewParticipants?: () => void;
  userRole: UserRole;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  isRegistered, 
  onRegister, 
  onDelete, 
  onViewParticipants, 
  userRole 
}) => {
  return (
    <div className="group rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col shadow-2xl">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={event.bannerUrl || `https://picsum.photos/seed/${event.id}/800/400`} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-indigo-400 mono">
          {event.location}
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {event.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-indigo-600/80 backdrop-blur-sm rounded-md text-[9px] font-bold text-white uppercase">
              {tag}
            </span>
          ))}
        </div>
        
        {userRole === UserRole.ADMIN && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="absolute top-4 left-4 p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg backdrop-blur-md transition-all border border-red-500/30"
            title="Delete Event"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center justify-between">
            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="mono text-indigo-400 font-bold">{event.registeredCount}/{event.capacity} Enrolled</span>
          </div>
          <h3 className="text-xl font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">{event.title}</h3>
        </div>
        
        <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
          {event.description.replace(/#{1,6}\s/g, '').substring(0, 150)}...
        </p>

        <div className="space-y-3">
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
              style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }}
            ></div>
          </div>
          
          {userRole === UserRole.STUDENT && (
            <button 
              disabled={isRegistered || event.registeredCount >= event.capacity}
              onClick={onRegister}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                isRegistered 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default' 
                  : event.registeredCount >= event.capacity
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98]'
              }`}
            >
              {isRegistered ? 'Pulse Confirmed' : event.registeredCount >= event.capacity ? 'Event Full' : 'Register Now'}
            </button>
          )}
          
          {userRole === UserRole.ADMIN && (
            <button 
              onClick={onViewParticipants}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-indigo-400 font-bold rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              View Participants
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
