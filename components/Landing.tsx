
import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-400/10 rounded-full border border-indigo-400/20">
        Empowering Next-Gen Developers
      </div>
      <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight max-w-4xl">
        The Hub for <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Elite Coding Events</span>
      </h1>
      <p className="text-xl text-slate-400 mb-10 max-w-2xl">
        Register for hackathons, workshops, and tech talks. Connect with mentors, grow your portfolio, and pulse through the coding universe.
      </p>
      <div className="flex gap-4">
        <Link 
          to="/login" 
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-xl shadow-indigo-600/30"
        >
          Browse Events
        </Link>
        <Link 
          to="/login" 
          className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all"
        >
          Host an Event
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          { title: "Host Securely", desc: "Advanced admin controls for event creators to manage participant flow." },
          { title: "Real-time Stats", desc: "Transparent registration counts for both organizers and students." },
          { title: "AI Descriptions", desc: "Generate professional event copy instantly with Gemini integration." }
        ].map((feat, i) => (
          <div key={i} className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-left hover:border-indigo-500/50 transition-all group">
            <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-400 transition-colors">{feat.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
