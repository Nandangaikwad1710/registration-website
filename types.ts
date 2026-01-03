
export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizerId: string;
  tags: string[];
  capacity: number;
  registeredCount: number;
  bannerUrl: string;
}

export interface Registration {
  id: string;
  eventId: string;
  studentId: string;
  timestamp: string;
}

export interface AppState {
  currentUser: User | null;
  events: Event[];
  registrations: Registration[];
}
