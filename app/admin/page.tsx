import React from 'react';
import { db } from '@/app/lib/db';
import { testSessions, testParticipants, testResults } from '@/db/schema';
import { count, eq } from 'drizzle-orm';
import { seedDatabase } from './actions';
import { 
  Users, 
  Activity, 
  CheckCircle2, 
  Clock,
  Database
} from 'lucide-react';

export default async function AdminDashboard() {
  // Fetch stats
  const [sessionsCount] = await db.select({ value: count() }).from(testSessions);
  const [participantsCount] = await db.select({ value: count() }).from(testParticipants);
  const [completedCount] = await db.select({ value: count() })
    .from(testParticipants)
    .where(eq(testParticipants.status, 'completed'));
  const [resultsCount] = await db.select({ value: count() }).from(testResults);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sessions" 
          value={sessionsCount.value.toString()} 
          icon={<Activity className="text-blue-500" />}
          trend="+2 this week"
        />
        <StatCard 
          title="Participants" 
          value={participantsCount.value.toString()} 
          icon={<Users className="text-indigo-500" />}
          trend="+12 this week"
        />
        <StatCard 
          title="Completed" 
          value={completedCount.value.toString()} 
          icon={<CheckCircle2 className="text-emerald-500" />}
          trend="85% completion rate"
        />
        <StatCard 
          title="Total Reports" 
          value={resultsCount.value.toString()} 
          icon={<Clock className="text-amber-500" />}
          trend="Last update 5m ago"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <p className="text-sm text-slate-500 italic">Activity log coming soon...</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <form action={seedDatabase}>
              <button type="submit" className="w-full p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl font-medium text-sm hover:bg-amber-100 transition-colors flex items-center justify-center">
                <Database size={16} className="mr-2" />
                Seed Sample Data
              </button>
            </form>
            <button className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-medium text-sm hover:bg-emerald-100 transition-colors">
              Export All Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
          {icon}
        </div>
        <span className="text-xs font-medium text-slate-400">{trend}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h4 className="text-3xl font-bold mt-1">{value}</h4>
      </div>
    </div>
  );
}
