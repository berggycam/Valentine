'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../components/DashboardHeader';
import ProposalForm from '../components/ProposalForm';
import ProposalDashboard from '../components/ProposalDashboard';
import SuccessModal from '../components/SuccessModal';

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
  answer: 'yes' | 'no';
  message: string;
  respondedAt: string;
}

export default function Home() {
  const [showCreateForm, setShowCreateForm] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [userProposals, setUserProposals] = useState<Proposal[]>([]);
  const [createdProposalId, setCreatedProposalId] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<Proposal[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    fromName: '',
    toName: '',
    fromEmail: '',
    toEmail: '',
    relationship: '',
    memory: '',
    future: '',
    emotions: [] as string[],
    message: '',
    public: false
  });

  const emotionOptions = [
    'Love', 'Joy', 'Excitement', 'Hope', 'Nervousness', 
    'Happiness', 'Adoration', 'Passion', 'Tenderness', 'Gratitude'
  ];

  const steps = [
    { id: 1, title: 'Your Name', description: 'Tell us who you are' },
    { id: 2, title: 'Their Name', description: 'Who are you proposing to?' },
    { id: 3, title: 'Relationship', description: 'What is your relationship?' },
    { id: 4, title: 'Special Memory', description: 'Share a special memory' },
    { id: 5, title: 'Your Emotions', description: 'What are you feeling?' },
    { id: 6, title: 'Future Together', description: 'What are you looking forward to?' },
    { id: 7, title: 'Your Message', description: 'Write your proposal' },
    { id: 8, title: 'Privacy', description: 'Set your preferences' },
    { id: 9, title: 'Create & Share', description: 'Generate your proposal' }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.fromName.trim() !== '';
      case 2:
        return formData.toName.trim() !== '';
      case 3:
        return formData.relationship.trim() !== '';
      case 4:
        return formData.memory.trim() !== '';
      case 5:
        return formData.emotions.length > 0;
      case 6:
        return formData.future.trim() !== '';
      case 7:
        return formData.message.trim() !== '';
      case 8:
        return formData.fromEmail.trim() !== '' && formData.fromEmail.includes('@');
      case 9:
        return true;
      case 10:
        return true;
      default:
        return false;
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const proposalId = urlParams.get('proposal');
    if (proposalId) {
      window.location.href = `/proposal?proposal=${proposalId}`;
    }
  }, []);

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromName: formData.fromName,
          toName: formData.toName,
          fromEmail: formData.fromEmail,
          toEmail: formData.toEmail,
          message: formData.message,
          emotions: formData.emotions,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create proposal');
      }

      const newProposal = await response.json();
      setCreatedProposalId(newProposal.data.id);
      setShowSuccessModal(true);
      
      // Reset form
      setFormData({
        fromName: '',
        toName: '',
        fromEmail: '',
        toEmail: '',
        relationship: '',
        memory: '',
        future: '',
        message: '',
        emotions: [],
        public: false
      });
      setCurrentStep(1);
      
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Failed to create proposal. Please try again.');
    }
  };

  const fetchUserProposals = async (name: string) => {
    try {
      const response = await fetch('/api/proposals');
      if (response.ok) {
        const allProposalsResponse = await response.json();
        const allProposals = allProposalsResponse.data;
        const userProposals = allProposals.filter((p: Proposal) => 
          p.fromName === name
        );
        setUserProposals(userProposals);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const shareProposal = (proposalId: string) => {
    const shareableLink = `${window.location.origin}/proposal?proposal=${proposalId}`;
    navigator.clipboard.writeText(shareableLink);
    alert('Link copied to clipboard! Share it with your partner.');
  };

  const searchProposalsByEmail = async (email: string) => {
    try {
      const response = await fetch('/api/proposals');
      if (!response.ok) {
        throw new Error('Failed to fetch proposals');
      }
      const allProposalsResponse = await response.json();
      const allProposals = allProposalsResponse.data;
      const matchedProposals = allProposals.filter((p: Proposal) => 
        p.fromEmail.toLowerCase() === email.toLowerCase()
      );
      setSearchResults(matchedProposals);
      return matchedProposals;
    } catch (error) {
      console.error('Error searching proposals:', error);
      alert('Failed to search proposals. Please try again.');
      return [];
    }
  };
  
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;
    
    const results = await searchProposalsByEmail(searchEmail);
    if (results.length === 0) {
      alert('No proposals found for this email address.');
    } else {
      setShowDashboard(true);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
        <DashboardHeader 
          showDashboard={showDashboard}
          onTabChange={setShowDashboard}
          onBackToHome={() => setShowLanding(true)}
          showLanding={showLanding}
        />

        {/* Main Content */}
        {showLanding ? (
          <div className="text-center py-8 sm:py-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-6 sm:mb-8 romantic-font">
              Valentine Proposal 💕
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-8 sm:mb-12 px-4">
              Create a romantic proposal or check responses to your proposals
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 px-4">
              <button
                onClick={() => {
                  setShowLanding(false);
                  setShowDashboard(false);
                }}
                className="group relative px-6 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold text-lg sm:text-xl hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Proposal</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-pink-100 text-pink-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Start a new proposal
                </div>
              </button>
              
              <button
                onClick={() => {
                  setShowLanding(false);
                  setShowDashboard(true);
                  fetchUserProposals(''); // Fetch all proposals for dashboard
                }}
                className="group relative px-6 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl font-bold text-lg sm:text-xl hover:from-purple-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>See Responses</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  View proposals & responses
                </div>
              </button>
            </div>
            
            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-3">💝</div>
                <h3 className="font-semibold text-gray-800 mb-2">Personalized</h3>
                <p className="text-sm text-gray-600">Create unique, heartfelt proposals</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-3">💌</div>
                <h3 className="font-semibold text-gray-800 mb-2">Share Instantly</h3>
                <p className="text-sm text-gray-600">Send your proposal via link</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-3">💕</div>
                <h3 className="font-semibold text-gray-800 mb-2">Track Responses</h3>
                <p className="text-sm text-gray-600">See their answer in real-time</p>
              </div>
            </div>
          </div>
        ) : !showDashboard ? (
          <ProposalForm
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            canProceed={canProceed}
            onSubmit={handleCreateProposal}
          />
        ) : (
          <ProposalDashboard
            userProposals={userProposals}
            onShareProposal={shareProposal}
          />
        )}

        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          proposalId={createdProposalId}
          toName={formData.toName}
          onViewProposals={() => setShowDashboard(true)}
        />
      </div>
    </div>
  );
}
