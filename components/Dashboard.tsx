
import React, { useState, useEffect } from 'react';
import { User, UserRole, Event, Registration } from '../types';
import { dbService } from '../services/db';
import EventCard from './EventCard';
import CreateEventModal from './CreateEventModal';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'registered'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [evs, regs] = await Promise.all([
      dbService.getEvents(),
      dbService.getRegistrations()
    ]);
    setEvents(evs);
    setRegistrations(regs);
  };

  const handleRegister = async (eventId: string) => {
    const reg = await dbService.register(eventId, user.id);
    if (reg) {
      await loadData();
      alert('Successfully registered!');
    } else {
      alert('You are already registered for this event!');
    }
  };

  const registeredEventIds = registrations
    .filter(r => r.studentId === user.id)
    .map(r => r.eventId);

  const displayedEvents = filter === 'all' 
    ? events 
    : events.filter(e => registeredEventIds.includes(e.id));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Event Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user.name}. Here's what's happening.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {user.role === UserRole.STUDENT && (
            <div className="flex p-1 bg-white/5 rounded-lg border border-white/10">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                All Events
              </button>
              <button 
                onClick={() => setFilter('registered')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'registered' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                My Registrations
              </button>
            </div>
          )}
          {user.role === UserRole.ADMIN && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Event
            </button>
          )}
        </div>
      </div>

      {displayedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              isRegistered={registeredEventIds.includes(event.id)}
              onRegister={() => handleRegister(event.id)}
              userRole={user.role}
            />
          ))}
        </div>
      ) : (
        <div className="p-20 border-2 border-dashed border-white/10 rounded-3xl text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
          <p className="text-slate-400 max-w-xs mx-auto">
            {filter === 'all' 
              ? "There are currently no active coding events. Check back later!" 
              : "You haven't registered for any events yet."}
          </p>
        </div>
      )}

      {isModalOpen && (
        <CreateEventModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); loadData(); }}
          adminId={user.id}
        />
      )}
    </div>
  );
};

export default Dashboard;
