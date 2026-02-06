import React from 'react';
import { CheckCircle, Trophy, PlayCircle, Shield } from 'lucide-react';
import { getDashboardStats } from '@/lib/dashboard-stats';

interface UserDashboardProps {
  course: any;
  progress: any;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ course, progress }) => {
  // Using the utility function we created earlier
  const { completionPercentage, badges, remaining } = getDashboardStats(course, progress);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Mechanic!</h1>
        <p className="text-slate-400">You are {completionPercentage}% through your Technical Certification.</p>
        
        <div className="mt-6 bg-slate-700/50 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-indigo-500 h-full transition-all duration-1000" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-semibold uppercase mb-4">Current Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Lessons Left</span>
              <span className="font-bold text-xl text-slate-900">{remaining}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Skill Level</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Apprentice</span>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-semibold uppercase mb-4">Earned Skill Badges</h3>
          <div className="flex flex-wrap gap-4">
            {badges.length > 0 ? (
              badges.map(badge => (
                <div key={badge} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full border border-indigo-100 font-medium">
                  <Trophy size={16} />
                  {badge}
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic">Complete your first technical lesson to earn a badge!</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg">
        <PlayCircle size={24} />
        Continue Next Lesson
      </button>
    </div>
  );
};

export default UserDashboard;
