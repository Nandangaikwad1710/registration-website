
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role
    });
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 text-center">Join HackPulse</h2>
        <p className="text-slate-400 text-center mb-8">Choose your path to get started.</p>
        
        <div className="flex p-1 bg-black rounded-xl mb-8">
          <button 
            onClick={() => setRole(UserRole.STUDENT)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === UserRole.STUDENT ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            Student
          </button>
          <button 
            onClick={() => setRole(UserRole.ADMIN)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === UserRole.ADMIN ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 pl-1">Full Name</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Alex Chen"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 pl-1">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="alex@university.edu"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 mt-4"
          >
            Continue as {role === UserRole.ADMIN ? 'Administrator' : 'Student'}
          </button>
        </form>
        
        <p className="mt-8 text-xs text-center text-slate-500 leading-relaxed px-4">
          By continuing, you agree to HackPulse's terms of service and our student privacy policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
