import React from 'react';
import { db } from '@/app/lib/db';
import { testSessions } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { createSession } from './actions';
import { Plus, Power, Copy, Trash2 } from 'lucide-react';

export default async function SessionsPage() {
  const sessions = await db.query.testSessions.findMany({
    orderBy: [desc(testSessions.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Test Sessions</h2>
          <p className="text-purple-800/70">Manage access codes for participants.</p>
        </div>
      </div>

      {/* Quick Create Form */}
      <div className="bg-white  p-6 rounded-2xl border border-purple-100  shadow-sm">
        <h3 className="text-sm font-semibold mb-4 text-purple-400 uppercase tracking-wider">Create New Session</h3>
        <form action={createSession} className="flex gap-4">
          <input 
            name="title" 
            placeholder="Session Title (e.g., Hiring Batch A)" 
            className="flex-1 px-4 py-2 rounded-lg border border-purple-100  bg-transparent"
            required
          />
          <input 
            name="accessCode" 
            placeholder="Custom Code (Optional)" 
            className="w-48 px-4 py-2 rounded-lg border border-purple-100  bg-transparent"
          />
          <select 
            name="testType"
            className="px-4 py-2 rounded-lg border border-purple-100  bg-transparent"
            required
          >
            <option value="cpm">CPM (IQ)</option>
            <option value="cfit">CFIT (IQ)</option>
            <option value="tiu">TIU (IQ)</option>
            <option value="bakum">BAKUM (Bakat)</option>
            <option value="epps">EPPS (Minat)</option>
            <option value="minat_jabatan">Minat Jabatan</option>
          </select>
          <button 
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Create
          </button>
        </form>
      </div>

      {/* Sessions Table */}
      <div className="bg-white  rounded-2xl border border-purple-100  shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-purple-50  border-b border-purple-100 ">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900 ">Title</th>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900 ">Access Code</th>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900 ">Test Type</th>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900 ">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900 ">Created</th>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900  text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-100 ">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-purple-50/50  transition-colors">
                <td className="px-6 py-4 font-medium">{session.title}</td>
                <td className="px-6 py-4">
                  <code className="px-2 py-1 bg-purple-100  rounded text-purple-700  font-mono font-bold">
                    {session.accessCode}
                  </code>
                </td>
                <td className="px-6 py-4 text-purple-800/70 uppercase text-sm font-medium">
                  {session.testType}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    session.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-950'
                  }`}>
                    {session.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-purple-800/70">
                  {new Date(session.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button title="Copy Code" className="p-2 text-purple-400 hover:text-purple-700">
                    <Copy size={16} />
                  </button>
                  <button title="Toggle Status" className="p-2 text-purple-400 hover:text-amber-600">
                    <Power size={16} />
                  </button>
                  <button title="Delete" className="p-2 text-purple-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
