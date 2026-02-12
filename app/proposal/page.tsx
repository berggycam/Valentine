'use client';

import { useEffect, useState } from 'react';
import DashboardHeader from '../../components/DashboardHeader';

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

export default function ProposalPage() {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [response, setResponse] = useState<Response | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const proposalId = urlParams.get('proposal');
    if (proposalId) {
      fetchProposal(proposalId);
    }
  }, []);

  const fetchProposal = async (id: string) => {
    try {
      const response = await fetch(`/api/proposals/${id}`);
      if (response.ok) {
        const proposalResponse = await response.json();
        setProposal(proposalResponse.data);
        
        // Fetch existing response
        const responseRes = await fetch(`/api/responses?proposalId=${id}`);
        if (responseRes.ok) {
          const responseData = await responseRes.json();
          if (responseData.data && responseData.data.length > 0) {
            setResponse(responseData.data[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching proposal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponseSubmit = async (answer: 'yes' | 'no') => {
    if (!proposal) return;

    const newResponse = {
      proposalId: proposal.id,
      message: answer === 'yes' 
        ? `YES! ${responseMessage}` 
        : `Sorry, ${responseMessage}`,
      fromName: proposal.toName, // The recipient is responding
      emotions: answer === 'yes' 
        ? ['Love', 'Happiness', 'Excitement']
        : ['Gratitude', 'Friendship']
    };

    try {
      await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResponse),
      });

      if (answer === 'yes') {
        setShowCelebration(true);
      } else {
        alert('Thank you for your response! 💕');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response. Please try again.');
    }
  };

  const handleNoHover = (e: React.MouseEvent) => {
    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 50;
    
    setNoButtonPosition({
      x: Math.random() * maxX,
      y: Math.random() * maxY
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-6xl animate-bounce">💕</div>
      </div>
    );
  }

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-red-400 to-pink-600 flex items-center justify-center overflow-hidden">
        <div className="text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-bounce">
            YES! 💕
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8">
            You made me the happiest person alive!
          </p>
          <div className="relative">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  fontSize: `${Math.random() * 20 + 20}px`
                }}
              >
                💕
              </div>
            ))}
            <div className="text-6xl md:text-8xl animate-bounce">🎉</div>
          </div>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-bold text-pink-600 mb-4">
            Proposal Not Found
          </h2>
          <p className="text-gray-700">
            The proposal you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  if (response) {
    const isYes = response.message.startsWith('YES!');
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full text-center">
          <div className="text-6xl mb-6">
            {isYes ? '💕' : '💔'}
          </div>
          <h2 className="text-2xl font-bold text-pink-600 mb-4">
            {isYes ? 'They Said YES!' : 'They Said No'}
          </h2>
          {response.message && (
            <p className="text-gray-700 mb-6 italic">
              "{response.message}"
            </p>
          )}
          <p className="text-sm text-gray-500">
            Responded on {new Date(response.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full">
        <DashboardHeader 
          showDashboard={false}
          onTabChange={() => {}}
          onBackToHome={() => window.location.href = '/'}
          showLanding={false}
        />

        <div className="text-center mb-8">
          <div className="text-6xl mb-6">💕</div>
          <h2 className="text-3xl font-bold text-pink-600 mb-4">
            From {proposal.fromName}
          </h2>
          <div className="bg-pink-50 rounded-lg p-6 mb-6">
            <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
              {proposal.message}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {proposal.emotions.map((emotion, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-pink-200 text-pink-800 rounded-full text-sm"
              >
                {emotion}
              </span>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a message (optional):
            </label>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-400 focus:outline-none text-gray-900 placeholder-gray-700 resize-none"
              rows={4}
              placeholder="Your response..."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleResponseSubmit('yes')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-bold text-lg hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              YES! 💕
            </button>
            <button
              onClick={handleNoHover}
              onMouseEnter={handleNoHover}
              style={{
                position: (noButtonPosition.x !== 0 || noButtonPosition.y !== 0) ? 'absolute' : 'static',
                left: noButtonPosition.x !== 0 || noButtonPosition.y !== 0 ? `${noButtonPosition.x}px` : 'auto',
                top: noButtonPosition.x !== 0 || noButtonPosition.y !== 0 ? `${noButtonPosition.y}px` : 'auto'
              }}
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-bold text-lg hover:bg-gray-300 transition-all duration-200"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
