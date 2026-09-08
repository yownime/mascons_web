import React from 'react';
import { db } from '@/app/lib/db';
import { testResults, testParticipants, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { FileDown, Eye, FileText, FileSpreadsheet } from 'lucide-react';

export default async function ResultsPage() {
  const results = await db
    .select({
      id: testResults.id,
      participantId: testResults.participantId,
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
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">Test Results</h2>
          <p className="text-purple-800/70">View and export psychological test reports.</p>
        </div>
        
        <div>
          <a href="/admin/results/epps" className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-900 text-sm font-semibold rounded-xl hover:bg-purple-200 transition-colors shadow-sm">
            <FileSpreadsheet size={16} className="mr-2" />
            EPPS Master Recap
          </a>
        </div>
      </div>

      <div className="bg-white  rounded-2xl border border-purple-100  shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-purple-50  border-b border-purple-100 ">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900 ">Participant</th>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900 ">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900 ">Score Summary</th>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900  text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-100 ">
            {results.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-purple-800/70 italic">
                  No results found yet.
                </td>
              </tr>
            ) : results.map((result) => (
              <tr key={result.id} className="hover:bg-purple-50/50  transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium">{result.userName}</p>
                  <p className="text-xs text-purple-800/70">{result.userEmail}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-purple-50 text-purple-700  rounded text-xs font-bold uppercase">
                    {result.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-mono truncate max-w-xs">
                  {result.scoreSummary || 'N/A'}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-purple-100  text-purple-900  rounded-lg hover:bg-slate-200 transition-colors">
                    <Eye size={14} className="mr-1.5" />
                    View
                  </button>
                  <a 
                    href={`/api/reports/${result.category}/${result.participantId}`} 
                    target="_blank"
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
                  >
                    <FileDown size={14} className="mr-1.5" />
                    PDF Report
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-6 bg-amber-50  border border-amber-200 rounded-2xl">
        <h4 className="text-sm font-bold text-amber-800  flex items-center">
          <FileText size={16} className="mr-2" />
          PDF Generation Strategy
        </h4>
        <p className="mt-2 text-sm text-amber-700  leading-relaxed">
          For Vercel environment, I recommend using <code className="font-mono bg-amber-100  px-1 rounded">@react-pdf/renderer</code>. 
          It allows you to define PDF layouts using React components and generate them on the server or client. 
          Unlike Puppeteer, it has a smaller footprint and works reliably in serverless functions.
        </p>
      </div>
    </div>
  );
}
