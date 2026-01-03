
import { Event, Registration, User, UserRole } from '../types';

const DB_KEYS = {
  EVENTS: 'hp_events',
  REGISTRATIONS: 'hp_registrations',
  USER: 'hp_user',
  USERS: 'hp_users_list' // To simulate a users table
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

  // Simulate SQL: SELECT * FROM events
  async getEvents(): Promise<Event[]> {
    const raw = localStorage.getItem(DB_KEYS.EVENTS);
    return raw ? JSON.parse(raw) : [];
  }

  async deleteEvent(eventId: string): Promise<void> {
    const events = await this.getEvents();
    const filtered = events.filter(e => e.id !== eventId);
    localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify(filtered));
    
    // Cascading delete simulation
    const regs = await this.getRegistrations();
    const filteredRegs = regs.filter(r => r.eventId !== eventId);
    localStorage.setItem(DB_KEYS.REGISTRATIONS, JSON.stringify(filteredRegs));
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

  // Admin access: SELECT u.name, u.email FROM registrations r JOIN users u ON r.student_id = u.id WHERE r.event_id = ?
  async getParticipants(eventId: string): Promise<(User & { registeredAt: string })[]> {
    const regs = await this.getRegistrations();
    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    
    return regs
      .filter(r => r.eventId === eventId)
      .map(r => {
        const user = users.find((u: User) => u.id === r.studentId);
        return {
          ...user,
          registeredAt: r.timestamp
        };
      })
      .filter(u => u.id); // Ensure user still exists
  }

  async register(eventId: string, studentId: string): Promise<Registration | null> {
    const regs = await this.getRegistrations();
    const events = await this.getEvents();
    
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
    
    // Ensure user is in the "users table"
    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    if (!users.some((u: User) => u.id === user.id)) {
      users.push(user);
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    }
  }
}

export const dbService = DBService.getInstance();
