'use client';

interface FormData {
  fromName: string;
  toName: string;
  fromEmail: string;
  toEmail: string;
  relationship: string;
  memory: string;
  future: string;
  emotions: string[];
  message: string;
  public: boolean;
}

interface ProposalFormProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  canProceed: () => boolean;
}

const emotions = [
  'Love', 'Joy', 'Excitement', 'Hope', 'Gratitude', 
  'Nervousness', 'Happiness', 'Romance', 'Passion', 'Devotion'
];

const relationships = [
  'Girlfriend/Boyfriend', 'Fiancé/Fiancée', 'Wife/Husband', 
  'Partner', 'Crush', 'Best Friend'
];

export default function ProposalForm({ 
  formData, 
  setFormData, 
  currentStep, 
  setCurrentStep, 
  canProceed 
}: ProposalFormProps) {
  const toggleEmotion = (emotion: string) => {
    setFormData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
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
        );

      case 2:
        return (
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
                placeholder="Enter their beautiful name"
                autoFocus
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🌟</div>
              <p className="text-gray-600">What's your relationship?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {relationships.map((rel) => (
                <button
                  key={rel}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, relationship: rel }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.relationship === rel
                      ? 'border-pink-400 bg-pink-50 text-pink-700'
                      : 'border-pink-200 hover:border-pink-300 text-gray-700'
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">💝</div>
              <p className="text-gray-600">Share a special memory</p>
            </div>
            <textarea
              value={formData.memory}
              onChange={(e) => setFormData(prev => ({ ...prev, memory: e.target.value }))}
              className="w-full p-3 border-2 border-pink-200 rounded-lg resize-none focus:border-pink-400 focus:outline-none text-gray-900 placeholder-gray-500 bg-white"
              rows={4}
              placeholder="Tell us about a special moment you've shared..."
              autoFocus
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🦋</div>
              <p className="text-gray-600">What are you feeling right now?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {emotions.map((emotion) => (
                <button
                  key={emotion}
                  type="button"
                  onClick={() => toggleEmotion(emotion)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.emotions.includes(emotion)
                      ? 'border-pink-400 bg-pink-50 text-pink-700'
                      : 'border-pink-200 hover:border-pink-300 text-gray-700'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">💌</div>
              <p className="text-gray-600">What are you looking forward to?</p>
            </div>
            <textarea
              value={formData.future}
              onChange={(e) => setFormData(prev => ({ ...prev, future: e.target.value }))}
              className="w-full p-3 border-2 border-pink-200 rounded-lg resize-none focus:border-pink-400 focus:outline-none text-gray-900 placeholder-gray-500 bg-white"
              rows={4}
              placeholder="Describe your hopes and dreams together..."
              autoFocus
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">💖</div>
              <p className="text-gray-600">Write your proposal message</p>
            </div>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full p-3 border-2 border-pink-200 rounded-lg resize-none focus:border-pink-400 focus:outline-none text-gray-900 placeholder-gray-500 bg-white"
              rows={6}
              placeholder="Pour your heart out and write the perfect proposal..."
              autoFocus
            />
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">📧</div>
              <p className="text-gray-600">Privacy settings</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.public}
                  onChange={(e) => setFormData(prev => ({ ...prev, public: e.target.checked }))}
                  className="w-5 h-5 text-pink-600 border-2 border-pink-300 rounded focus:ring-pink-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Make this proposal public</p>
                  <p className="text-sm text-gray-600">Others can see and respond to this proposal</p>
                </div>
              </label>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-gray-600">Review your proposal</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">From:</p>
                <p className="font-semibold">{formData.fromName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">To:</p>
                <p className="font-semibold">{formData.toName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Relationship:</p>
                <p className="font-semibold">{formData.relationship}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Message:</p>
                <p className="font-medium">{formData.message}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Emotions:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.emotions.map((emotion, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-pink-200 text-pink-800 rounded-full text-xs"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-8">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      {currentStep < 9 && (
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(9, currentStep + 1))}
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
  );
}
