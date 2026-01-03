
import React, { useState } from 'react';
import { aiService } from '../services/ai';
import { dbService } from '../services/db';

interface CreateEventModalProps {
  onClose: () => void;
  onSuccess: () => void;
  adminId: string;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose, onSuccess, adminId }) => {
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: 'Virtual',
    capacity: 100,
    tags: '',
    bannerUrl: ''
  });

  const handleAiGenerate = async () => {
    if (!formData.title) {
      alert('Please enter a title first');
      return;
    }
    setAiGenerating(true);
    const tagsArr = formData.tags.split(',').map(t => t.trim());
    const desc = await aiService.generateDescription(formData.title, tagsArr);
    setFormData(prev => ({ ...prev, description: desc }));
    setAiGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dbService.saveEvent({
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        organizerId: adminId
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">Create Elite Event</h2>
            <p className="text-slate-400 text-sm">Design a new coding experience for students.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 pl-1">Event Title</label>
              <input 
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Winter 2024 AI Hackathon"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 pl-1">Date</label>
              <input 
                required
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 pl-1">Location / Platform</label>
              <input 
                required
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Zoom, Building C, etc."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 pl-1">Capacity</label>
              <input 
                required
                type="number"
                value={formData.capacity}
                onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 pl-1">Tags (comma separated)</label>
              <input 
                required
                type="text"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                placeholder="React, AI, Python"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 pl-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</label>
              <button 
                type="button"
                onClick={handleAiGenerate}
                disabled={aiGenerating}
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase flex items-center gap-1.5"
              >
                {aiGenerating ? (
                  <span className="animate-pulse">Generating...</span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95l1.418 15.111 2.822-2.822a1 1 0 011.414 1.414l-4.586 4.586a1 1 0 01-1.414 0l-4.586-4.586a1 1 0 011.414-1.414l2.822 2.822L7.88 2.397a1 1 0 01.95-1.1h2.47zM4.333 11a1 1 0 100-2 1 1 0 000 2zM3 14a1 1 0 100-2 1 1 0 000 2zm1-8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Magic Write (AI)
                  </>
                )}
              </button>
            </div>
            <textarea 
              required
              rows={6}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell students what this event is about..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none text-sm leading-relaxed"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
