
import React from 'react';
import { Event, UserRole } from '../types';

interface EventCardProps {
  event: Event;
  isRegistered: boolean;
  onRegister: () => void;
  userRole: UserRole;
}

const EventCard: React.FC<EventCardProps> = ({ event, isRegistered, onRegister, userRole }) => {
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
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center justify-between">
            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="mono text-indigo-400">{event.registeredCount}/{event.capacity} Enrolled</span>
          </div>
          <h3 className="text-xl font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">{event.title}</h3>
        </div>
        
        <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
          {event.description.replace(/#{1,6}\s/g, '').substring(0, 150)}...
        </p>

        <div className="space-y-3">
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all" 
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
              {isRegistered ? 'Successfully Registered' : event.registeredCount >= event.capacity ? 'Event Full' : 'Register Now'}
            </button>
          )}
          
          {userRole === UserRole.ADMIN && (
            <div className="text-center py-2 px-4 bg-white/5 rounded-xl border border-white/10 text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Admin View Only
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
