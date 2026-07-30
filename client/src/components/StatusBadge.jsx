import React from 'react';
import { AlertCircle, Clock, CheckCircle2, Truck, Sparkles, Award } from 'lucide-react';

export const PriorityBadge = ({ priority = 'Medium', score }) => {
  if (priority === 'High') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 glow-rose">
        <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
        HIGH PRIORITY {score ? `(${score}%)` : ''}
      </span>
    );
  }
  if (priority === 'Medium') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Clock className="w-3.5 h-3.5" />
        MEDIUM PRIORITY {score ? `(${score}%)` : ''}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <Sparkles className="w-3.5 h-3.5" />
      LOW PRIORITY
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    'Created': { color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: Clock },
    'AI Analysed': { color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: Sparkles },
    'NGO Accepted': { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Award },
    'Volunteer Assigned': { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Truck },
    'Picked Up': { color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: Truck },
    'Delivered': { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
    'Completed': { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: CheckCircle2 }
  };

  const current = map[status] || map['Created'];
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${current.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};
