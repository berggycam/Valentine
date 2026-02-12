'use client';

interface DashboardHeaderProps {
  showDashboard: boolean;
  onTabChange: (showDashboard: boolean) => void;
  onBackToHome?: () => void;
  showLanding?: boolean;
}

export default function DashboardHeader({ showDashboard, onTabChange, onBackToHome, showLanding }: DashboardHeaderProps) {
  return (
    <>
      {!showLanding && (
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
            <h1 className="text-3xl font-bold text-red-600 romantic-font">
              {showDashboard ? 'My Proposals' : 'Create Proposal'}
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      )}
    </>
  );
}
