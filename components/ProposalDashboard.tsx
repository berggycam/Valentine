'use client';

import { useState } from 'react';

interface Proposal {
  id: string;
  fromName: string;
  toName: string;
  fromEmail: string;
  toEmail: string;
  message: string;
  emotions: string[];
  createdAt: string;
}

interface ProposalDashboardProps {
  userProposals: Proposal[];
  onShareProposal: (id: string) => void;
}

export default function ProposalDashboard({ userProposals, onShareProposal }: ProposalDashboardProps) {
  const [searchEmail, setSearchEmail] = useState('');

  const filteredProposals = userProposals.filter(proposal => 
    searchEmail === '' || 
    proposal.fromEmail.toLowerCase().includes(searchEmail.toLowerCase()) ||
    proposal.toEmail.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 romantic-font">My Proposals & Responses</h2>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="email"
            placeholder="Search by email (from or to)..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-3.5 w-5 h-5 text-pink-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {searchEmail && (
          <p className="mt-2 text-sm text-gray-600">
            Found {filteredProposals.length} proposal{filteredProposals.length !== 1 ? 's' : ''} matching "{searchEmail}"
          </p>
        )}
      </div>
      
      {filteredProposals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-600">
            {searchEmail ? `No proposals found matching "${searchEmail}"` : 'No proposals yet. Create your first one!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProposals.map((proposal) => (
            <div key={proposal.id} className="bg-pink-50 rounded-lg p-4 border border-pink-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-pink-600">
                    To: {proposal.toName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    From: {proposal.fromName} ({proposal.fromEmail})
                  </p>
                  <p className="text-sm text-gray-600">
                    To: {proposal.toEmail}
                  </p>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(proposal.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {proposal.message.substring(0, 100)}...
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proposal.emotions.slice(0, 3).map((emotion, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-pink-200 text-pink-800 rounded-full text-xs"
                      >
                        {emotion}
                      </span>
                    ))}
                    {proposal.emotions.length > 3 && (
                      <span className="px-2 py-1 bg-pink-200 text-pink-800 rounded-full text-xs">
                        +{proposal.emotions.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onShareProposal(proposal.id)}
                    className="px-3 py-1 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
