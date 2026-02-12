'use client';

interface CreateProposalPopupProps {
  show: boolean;
  onClose: () => void;
  onCreateProposal: () => void;
}

export default function CreateProposalPopup({ show, onClose, onCreateProposal }: CreateProposalPopupProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 transform animate-bounce">
        <div className="text-center">
          <div className="text-6xl mb-4">💕</div>
          <h2 className="text-2xl font-bold text-pink-600 mb-4">
            Inspired to Create Your Own?
          </h2>
          <p className="text-gray-600 mb-6">
            Now that you've experienced this beautiful proposal, why not create one for someone special?
          </p>
          <div className="space-y-3">
            <button
              onClick={onCreateProposal}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-200"
            >
              Create My Proposal 💝
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
