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

interface Response {
  id: string;
  proposalId: string;
  message: string;
  fromName: string;
  emotions: string[];
  createdAt: string;
}

interface ProposalDashboardProps {
  userProposals: Proposal[];
  userResponses?: Response[];
  onShareProposal: (id: string) => void;
}

export default function ProposalDashboard({ userProposals, userResponses = [], onShareProposal }: ProposalDashboardProps) {
  const [userEmail, setUserEmail] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Only show proposals where user is involved
  const userSpecificProposals = userProposals.filter(proposal => 
    proposal.fromEmail.toLowerCase() === userEmail.toLowerCase() ||
    proposal.toEmail.toLowerCase() === userEmail.toLowerCase()
  );

  // Only show responses to user's proposals
  const userSpecificResponses = userResponses.filter(response => {
    const proposal = userProposals.find(p => p.id === response.proposalId);
    return proposal && (
      proposal.fromEmail.toLowerCase() === userEmail.toLowerCase() ||
      proposal.toEmail.toLowerCase() === userEmail.toLowerCase()
    );
  });

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 romantic-font">My Proposals & Responses</h2>
      
      {/* Search Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by email to see your proposals and responses..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-9 sm:pl-10 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base text-gray-800 placeholder-gray-700"
          />
          <svg
            className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-pink-400"
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
          <p className="mt-2 text-xs sm:text-sm text-gray-700 px-1">
            Found {filteredProposals.length + filteredResponses.length} result{filteredProposals.length + filteredResponses.length !== 1 ? 's' : ''} matching "{searchEmail}"
          </p>
        )}
      </div>
      
      {filteredProposals.length === 0 && filteredResponses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-700">
            {searchEmail ? `No results found matching "${searchEmail}"` : 'No proposals or responses yet. Create your first proposal!'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Proposals Section */}
          {filteredProposals.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-pink-600 mb-3">Proposals ({filteredProposals.length})</h3>
              <div className="grid gap-3 sm:gap-4">
                {filteredProposals.map((proposal) => (
                  <div key={proposal.id} className="bg-pink-50 rounded-lg p-3 sm:p-4 border border-pink-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-pink-600 text-base sm:text-lg">
                          To: {proposal.toName}
                        </h3>
                        <div className="mt-1 space-y-1">
                          <p className="text-xs sm:text-sm text-gray-700">
                            From: {proposal.fromName} ({proposal.fromEmail})
                          </p>
                          <p className="text-xs sm:text-sm text-gray-700">
                            To: {proposal.toEmail}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-700">
                            Created: {new Date(proposal.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                            {proposal.message.substring(0, 100)}...
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {proposal.emotions.slice(0, 3).map((emotion, index) => (
                            <span
                              key={index}
                              className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-pink-200 text-pink-800 rounded-full text-xs"
                            >
                              {emotion}
                            </span>
                          ))}
                          {proposal.emotions.length > 3 && (
                            <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-pink-200 text-pink-800 rounded-full text-xs">
                              +{proposal.emotions.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 sm:gap-2">
                        <button
                          onClick={() => onShareProposal(proposal.id)}
                          className="px-3 py-1.5 sm:px-3 sm:py-1 bg-pink-500 text-white rounded-lg text-xs sm:text-sm hover:bg-pink-600 whitespace-nowrap"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responses Section */}
          {filteredResponses.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-pink-600 mb-3">Responses ({filteredResponses.length})</h3>
              <div className="grid gap-3 sm:gap-4">
                {filteredResponses.map((response) => (
                  <div key={response.id} className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-purple-600 text-base sm:text-lg">
                        Response from: {response.fromName}
                      </h3>
                      <div className="mt-1 space-y-1">
                        <p className="text-xs sm:text-sm text-gray-700">
                          To: {userProposals.find(p => p.id === response.proposalId)?.toName || 'Unknown'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-700">
                          Responded: {new Date(response.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs sm:text-sm text-gray-700 line-clamp-3">
                          {response.message}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {response.emotions.slice(0, 3).map((emotion, index) => (
                          <span
                            key={index}
                            className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-purple-200 text-purple-800 rounded-full text-xs"
                          >
                            {emotion}
                          </span>
                        ))}
                        {response.emotions.length > 3 && (
                          <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-purple-200 text-purple-800 rounded-full text-xs">
                            +{response.emotions.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
