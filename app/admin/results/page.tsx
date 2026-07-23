import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { FileDown, Eye, FileText } from 'lucide-react';

export default async function ResultsPage() {
  const results = await db
    .select({
      id: testResults.id,
      category: testResults.category,
      scoreSummary: testResults.scoreSummary,
      createdAt: testResults.createdAt,
      userName: users.fullName,
      userEmail: users.email,
    })
    .from(testResults)
    .innerJoin(testParticipants, eq(testResults.participantId, testParticipants.id))
    .innerJoin(users, eq(testParticipants.userId, users.id))
    .orderBy(desc(testResults.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Test Results</h2>
        <p className="text-slate-500">View and export psychological test reports.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Participant</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Score Summary</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {results.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                  No results found yet.
                </td>
              </tr>
            ) : results.map((result) => (
              <tr key={result.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium">{result.userName}</p>
                  <p className="text-xs text-slate-500">{result.userEmail}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded text-xs font-bold uppercase">
                    {result.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-mono truncate max-w-xs">
                  {result.scoreSummary || 'N/A'}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition-colors">
                    <Eye size={14} className="mr-1.5" />
                    View
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <FileDown size={14} className="mr-1.5" />
                    PDF Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl">
        <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center">
          <FileText size={16} className="mr-2" />
          PDF Generation Strategy
        </h4>
        <p className="mt-2 text-sm text-amber-700 dark:text-amber-500 leading-relaxed">
          For Vercel environment, I recommend using <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">@react-pdf/renderer</code>. 
          It allows you to define PDF layouts using React components and generate them on the server or client. 
          Unlike Puppeteer, it has a smaller footprint and works reliably in serverless functions.
        </p>
      </div>
    </div>
  );
}
