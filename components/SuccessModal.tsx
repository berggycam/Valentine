'use client';

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
  proposalId: string;
  toName: string;
  onViewProposals: () => void;
}

export default function SuccessModal({ show, onClose, proposalId, toName, onViewProposals }: SuccessModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-pink-50 bg-opacity-95 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-pink-600 mb-4 romantic-font">
            Proposal Sent Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your proposal has been created! Share this link with {toName}:
          </p>
          <div className="bg-pink-100 rounded-lg p-4 mb-4">
            <p className="text-center text-pink-600 font-mono text-sm break-all">
              {typeof window !== 'undefined' ? `${window.location.origin}?proposal=${proposalId}` : `?proposal=${proposalId}`}
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  navigator.clipboard.writeText(`${window.location.origin}?proposal=${proposalId}`);
                  alert('Link copied to clipboard! Share it with your partner.');
                }
              }}
              className="w-full py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600"
            >
              Copy Link 📋
            </button>
            <button
              onClick={() => {
                onClose();
                onViewProposals();
              }}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
            >
              View My Proposals 📊
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
