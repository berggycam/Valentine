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
              {typeof window !== 'undefined' ? `${window.location.origin}/proposal?proposal=${proposalId}` : `/proposal?proposal=${proposalId}`}
            </p>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard.writeText(`${window.location.origin}/proposal?proposal=${proposalId}`);
                    alert('Link copied to clipboard! Share it with your partner.');
                  }
                }}
                className="py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 text-sm"
              >
                📋 Copy Link
              </button>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`I have something special to share with you! 💕 Check out my Valentine's proposal: ${window.location.origin}/proposal?proposal=${proposalId}`)}`;
                    window.open(whatsappUrl, '_blank');
                  }
                }}
                className="py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 text-sm"
              >
                💬 WhatsApp
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const emailUrl = `mailto:?subject=Valentine's Proposal 💕&body=${encodeURIComponent(`I have something special to share with you! 💕 Check out my Valentine's proposal: ${window.location.origin}/proposal?proposal=${proposalId}`)}`;
                    window.open(emailUrl, '_blank');
                  }
                }}
                className="py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 text-sm"
              >
                📧 Email
              </button>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I created a special Valentine's proposal! 💕 ${window.location.origin}/proposal?proposal=${proposalId}`)}`;
                    window.open(twitterUrl, '_blank');
                  }
                }}
                className="py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 text-sm"
              >
                � Twitter
              </button>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 mb-4 border border-purple-200">
              <p className="text-sm text-purple-800 font-medium mb-2">💝 DM me, let's work together</p>
              <p className="text-xs text-purple-700 mb-1">📧 Email: bergsjoseph@gmail.com</p>
              <p className="text-xs text-purple-700">📱 Call/WhatsApp: +233504744718</p>
            </div>
            
            <button
              onClick={() => {
                onClose();
                onViewProposals();
              }}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
            >
              View My Proposals & Responses 📊
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
