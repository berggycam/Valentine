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
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(true);
  const [showProposal, setShowProposal] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [showCelebration, setShowCelebration] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [userProposals, setUserProposals] = useState<Proposal[]>([]);
  const [createdProposalId, setCreatedProposalId] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<Proposal[]>([]);
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
        return true;
      case 9:
        return true;
      default:
        return false;
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const proposalId = urlParams.get('proposal');
    if (proposalId) {
      fetchProposal(proposalId);
    }
  }, []);

  const fetchProposal = async (id: string) => {
    try {
      const response = await fetch(`https://valentine-kohl-seven.vercel.app/api/proposals/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProposal(data);
        setShowCreateForm(false);
        setShowProposal(true);
      }
    } catch (error) {
      console.error('Error fetching proposal:', error);
    }
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://valentine-kohl-seven.vercel.app/api/proposals', {
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
      setCreatedProposalId(newProposal.id);
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
      const response = await fetch('https://valentine-kohl-seven.vercel.app/api/proposals');
      if (response.ok) {
        const allProposals = await response.json();
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
    const shareableLink = `${window.location.origin}?proposal=${proposalId}`;
    navigator.clipboard.writeText(shareableLink);
    alert('Link copied to clipboard! Share it with your partner.');
  };

  const handleNoButtonHover = () => {
    const newX = Math.random() * 200 - 100;
    const newY = Math.random() * 200 - 100;
    setNoButtonPosition({ x: newX, y: newY });
  };

  const handleYesClick = () => {
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 5000);
  };

  const handleResponseSubmit = async (answer: 'yes' | 'no') => {
    if (!proposal) return;

    const newResponse: Omit<Response, 'id' | 'respondedAt'> = {
      proposalId: proposal.id,
      answer,
      message: responseMessage
    };

    try {
      await fetch('https://valentine-kohl-seven.vercel.app/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResponse),
      });

      if (answer === 'yes') {
        handleYesClick();
      } else {
        alert('Thank you for your honest response!');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const toggleEmotion = (emotion: string) => {
    setFormData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const searchProposalsByEmail = async (email: string) => {
    try {
      const response = await fetch('https://valentine-kohl-seven.vercel.app/api/proposals');
      if (!response.ok) {
        throw new Error('Failed to fetch proposals');
      }
      const allProposals = await response.json();
      const matchedProposals = allProposals.filter((p: Proposal) => 
        p.toEmail.toLowerCase() === email.toLowerCase() || 
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

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-red-400 to-pink-600 flex items-center justify-center overflow-hidden">
        <div className="text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-bounce">
            Happy Valentine's Day! �
          </h1>
          <p className="text-xl text-white mb-8">
            {proposal?.fromName} is so happy to be your Valentine!
          </p>
          <button
            onClick={() => setShowCelebration(false)}
            className="px-8 py-3 bg-white text-pink-600 rounded-full font-bold text-lg hover:bg-pink-50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
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
            {['❤️', '🌹', '💕', '✨', '🎉'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
    );
  }

  if (showProposal && proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-red-600 mb-4 romantic-font">
              Dear {proposal.toName},
            </h1>
            <div className="text-6xl mb-4">💕</div>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              {proposal.message}
            </p>
            <p className="text-lg text-gray-600 mb-6">
              With all my love,<br />
              {proposal.fromName}
            </p>
            
            {proposal.emotions.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">I'm feeling:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {proposal.emotions.map((emotion, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 romantic-font">
              Will you be my Valentine?
            </h2>
            
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => handleResponseSubmit('yes')}
                className="px-8 py-4 bg-green-500 text-white rounded-full font-bold text-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                YES! 💕
              </button>
              
              <button
                onMouseEnter={handleNoButtonHover}
                onClick={() => handleResponseSubmit('no')}
                className="px-8 py-4 bg-gray-400 text-white rounded-full font-bold text-lg hover:bg-gray-500 transform transition-all duration-200 shadow-lg relative"
                style={{
                  transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`
                }}
              >
                No
              </button>
            </div>

            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder="Leave a message (optional)..."
              className="w-full p-3 border-2 border-pink-200 rounded-lg resize-none focus:border-pink-400 focus:outline-none text-gray-900 placeholder-gray-500 bg-white"
              rows={3}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-6xl w-full mx-auto">
        <DashboardHeader 
          showDashboard={showDashboard}
          onTabChange={setShowDashboard}
        />

        {/* Main Content */}
        {!showDashboard ? (
          <ProposalForm
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            canProceed={canProceed}
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
