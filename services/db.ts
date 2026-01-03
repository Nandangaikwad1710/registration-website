
import { Event, Registration, User, UserRole } from '../types';

// In a real app, these would be calls to a PostgreSQL-backed API.
// We're using localStorage to simulate persistence in this demo environment.

const DB_KEYS = {
  EVENTS: 'hp_events',
  REGISTRATIONS: 'hp_registrations',
  USER: 'hp_user'
};

export class DBService {
  private static instance: DBService;

  private constructor() {}

  public static getInstance(): DBService {
    if (!DBService.instance) {
      DBService.instance = new DBService();
    }
    return DBService.instance;
  }

  async getEvents(): Promise<Event[]> {
    const raw = localStorage.getItem(DB_KEYS.EVENTS);
    return raw ? JSON.parse(raw) : [];
  }

  async saveEvent(event: Omit<Event, 'id' | 'registeredCount'>): Promise<Event> {
    const events = await this.getEvents();
    const newEvent: Event = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      registeredCount: 0
    };
    events.push(newEvent);
    localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify(events));
    return newEvent;
  }

  async getRegistrations(): Promise<Registration[]> {
    const raw = localStorage.getItem(DB_KEYS.REGISTRATIONS);
    return raw ? JSON.parse(raw) : [];
  }

  async register(eventId: string, studentId: string): Promise<Registration | null> {
    const regs = await this.getRegistrations();
    const events = await this.getEvents();
    
    // Check if already registered
    if (regs.some(r => r.eventId === eventId && r.studentId === studentId)) {
      return null;
    }

    const newReg: Registration = {
      id: Math.random().toString(36).substr(2, 9),
      eventId,
      studentId,
      timestamp: new Date().toISOString()
    };
    
    regs.push(newReg);
    localStorage.setItem(DB_KEYS.REGISTRATIONS, JSON.stringify(regs));

    // Update event count
    const updatedEvents = events.map(e => 
      e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e
    );
    localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify(updatedEvents));

    return newReg;
  }

  async getUser(): Promise<User | null> {
    const raw = localStorage.getItem(DB_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  }

  async setUser(user: User): Promise<void> {
    localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
  }
}

export const dbService = DBService.getInstance();
