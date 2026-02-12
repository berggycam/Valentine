'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Proposal {
  id: string;
  fromName: string;
  toName: string;
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
  const router = useRouter();

  const [formData, setFormData] = useState({
    fromName: '',
    fromEmail: '',
    toName: '',
    toEmail: '',
    howYouMet: '',
    whatYouLove: '',
    yourFeelings: '',
    message: '',
    emotions: [] as string[]
  });

  const emotionOptions = [
    'Love', 'Joy', 'Excitement', 'Hope', 'Nervousness', 
    'Happiness', 'Adoration', 'Passion', 'Tenderness', 'Gratitude'
  ];

  const steps = [
    { id: 1, title: 'Your Name', description: 'Tell us who you are' },
    { id: 2, title: 'Their Name', description: 'Who are you proposing to?' },
    { id: 3, title: 'How You Met', description: 'Share your beautiful story' },
    { id: 4, title: 'What You Love', description: 'What makes them special?' },
    { id: 5, title: 'Your Feelings', description: 'How do they make you feel?' },
    { id: 6, title: 'Your Message', description: 'Write from your heart' },
    { id: 7, title: 'Your Emotions', description: 'What are you feeling?' },
    { id: 8, title: 'Your Email', description: 'We need this for sharing' },
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    switch (currentStep) {
      case 1:
        return formData.fromName.trim() !== '';
      case 2:
        return formData.toName.trim() !== '';
      case 3:
        return formData.howYouMet.trim() !== '';
      case 4:
        return formData.whatYouLove.trim() !== '';
      case 5:
        return formData.yourFeelings.trim() !== '';
      case 6:
        return formData.message.trim() !== '';
      case 7:
        return formData.emotions.length > 0;
      case 8:
        return emailRegex.test(formData.fromEmail);
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
      const response = await fetch(`http://localhost:3001/proposals/${id}`);
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
    
    const newProposal: Omit<Proposal, 'id' | 'createdAt'> = {
      fromName: formData.fromName,
      toName: formData.toName,
      message: `How we met: ${formData.howYouMet}

What I love about you: ${formData.whatYouLove}

How you make me feel: ${formData.yourFeelings}

My Valentine's message: ${formData.message}`,
      emotions: formData.emotions
    };

    try {
      const response = await fetch('http://localhost:3001/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProposal),
      });

      if (response.ok) {
        const createdProposal = await response.json();
        setCreatedProposalId(createdProposal.id);
        
        // Send email to recipient (in real app, you'd use an email service)
        console.log(`Sending proposal to ${formData.toEmail}`);
        
        setShowSuccessModal(true);
        setShowCreateForm(false);
        
        // Fetch user's proposals for dashboard
        await fetchUserProposals(formData.fromEmail);
      }
    } catch (error) {
      console.error('Error creating proposal:', error);
    }
  };

  const fetchUserProposals = async (email: string) => {
    try {
      const response = await fetch('http://localhost:3001/proposals');
      if (response.ok) {
        const allProposals = await response.json();
        const userProposals = allProposals.filter((p: Proposal) => 
          p.fromName === formData.fromName
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
      await fetch('http://localhost:3001/responses', {
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

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-red-400 to-pink-600 flex items-center justify-center overflow-hidden">
        <div className="text-center z-10">
          <h1 className="text-6xl font-bold text-white mb-4 animate-bounce romantic-font">
            YES! 💕
          </h1>
          <p className="text-2xl text-white mb-8">
            I'm so happy you said yes! Happy Valentine's Day!
          </p>
          <div className="text-8xl animate-pulse">
            🎉💖🌹✨💕
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-red-600 mb-4 romantic-font">
            Create Your Valentine's Proposal 💕
          </h1>
          <p className="text-gray-600">
            Craft a beautiful proposal to share with your special someone
          </p>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">👋</div>
                <p className="text-gray-600">Let's start with who you are</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.fromName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fromName: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-400 focus:outline-none text-lg text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Enter your beautiful name"
                  autoFocus
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">💕</div>
                <p className="text-gray-600">Who is the lucky person?</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Their Name
                </label>
                <input
                  type="text"
                  value={formData.toName}
                  onChange={(e) => setFormData(prev => ({ ...prev, toName: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-400 focus:outline-none text-lg text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Enter their special name"
                  autoFocus
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🌟</div>
                <p className="text-gray-600">Share your beautiful beginning</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How did you two meet?
                </label>
                <textarea
                  value={formData.howYouMet}
                  onChange={(e) => setFormData(prev => ({ ...prev, howYouMet: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg resize-none focus:border-pink-400 focus:outline-none text-lg text-gray-900 placeholder-gray-500 bg-white"
                  rows={4}
                  placeholder="Tell the story of how you met..."
                  autoFocus
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">💝</div>
                <p className="text-gray-600">What makes them so special?</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What do you love most about them?
                </label>
                <textarea
                  value={formData.whatYouLove}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatYouLove: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg resize-none focus:border-pink-400 focus:outline-none text-lg text-gray-900 placeholder-gray-500 bg-white"
                  rows={4}
                  placeholder="Share all the things you love about them..."
                  autoFocus
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🦋</div>
                <p className="text-gray-600">How do they make you feel?</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your feelings
                </label>
                <textarea
                  value={formData.yourFeelings}
                  onChange={(e) => setFormData(prev => ({ ...prev, yourFeelings: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg resize-none focus:border-pink-400 focus:outline-none text-lg text-gray-900 placeholder-gray-500 bg-white"
                  rows={4}
                  placeholder="How do they make your heart feel?"
                  autoFocus
                />
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">💌</div>
                <p className="text-gray-600">Pour your heart out</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg resize-none focus:border-pink-400 focus:outline-none text-lg text-gray-900 placeholder-gray-500 bg-white"
                  rows={6}
                  placeholder="Write your heartfelt Valentine's message..."
                  autoFocus
                />
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">💖</div>
                <p className="text-gray-600">What emotions are you feeling?</p>
                <p className="text-sm text-gray-500">Select at least one emotion</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {emotionOptions.map((emotion) => (
                  <label
                    key={emotion}
                    className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.emotions.includes(emotion)
                        ? 'border-pink-400 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.emotions.includes(emotion)}
                      onChange={() => toggleEmotion(emotion)}
                      className="w-5 h-5 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-gray-700 font-medium">{emotion}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">📧</div>
                <p className="text-gray-600">We need your email for sharing</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  value={formData.fromEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, fromEmail: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-400 focus:outline-none text-lg text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="your.email@example.com"
                  autoFocus
                />
              </div>
            </div>
          )}

          {currentStep === 9 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">✨</div>
                <p className="text-gray-600">Review your beautiful proposal</p>
              </div>
              
              <div className="bg-pink-50 rounded-lg p-6 space-y-4">
                <div>
                  <span className="font-semibold text-pink-600">From:</span> {formData.fromName} ({formData.fromEmail})
                </div>
                <div>
                  <span className="font-semibold text-pink-600">To:</span> {formData.toName}
                </div>
                <div>
                  <span className="font-semibold text-pink-600">How we met:</span>
                  <p className="mt-1 text-gray-700 italic">"{formData.howYouMet}"</p>
                </div>
                <div>
                  <span className="font-semibold text-pink-600">What I love about you:</span>
                  <p className="mt-1 text-gray-700 italic">"{formData.whatYouLove}"</p>
                </div>
                <div>
                  <span className="font-semibold text-pink-600">How you make me feel:</span>
                  <p className="mt-1 text-gray-700 italic">"{formData.yourFeelings}"</p>
                </div>
                <div>
                  <span className="font-semibold text-pink-600">My Valentine's message:</span>
                  <p className="mt-1 text-gray-700 italic">"{formData.message}"</p>
                </div>
                <div>
                  <span className="font-semibold text-pink-600">Emotions:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.emotions.map((emotion, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-pink-200 text-pink-800 rounded-full text-sm"
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateProposal}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg text-lg"
              >
                Create & Share Proposal 💕
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
        {currentStep < 9 && (
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                canProceed()
                  ? 'bg-pink-500 text-white hover:bg-pink-600 transform hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-pink-50 bg-opacity-95 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-pink-600 mb-4 romantic-font">
                Proposal Sent Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your proposal has been created! Share this link with {formData.toName}:
              </p>
              <div className="bg-pink-100 rounded-lg p-4 mb-4">
                <p className="text-center text-pink-600 font-mono text-sm break-all">
                  {window.location.origin}?proposal={createdProposalId}
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}?proposal=${createdProposalId}`);
                    alert('Link copied to clipboard! Share it with your partner.');
                  }}
                  className="w-full py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600"
                >
                  Copy Link 📋
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setShowDashboard(true);
                  }}
                  className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                >
                  View My Proposals 📊
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard */}
      {showDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-pink-600 romantic-font">
                My Proposals
              </h2>
              <button
                onClick={() => setShowDashboard(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            {userProposals.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-600">No proposals yet. Create your first one!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {userProposals.map((proposal) => (
                  <div key={proposal.id} className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-pink-600">
                          To: {proposal.toName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
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
                          onClick={() => shareProposal(proposal.id)}
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
        </div>
      )}
    </div>
    </div>
  );
}
