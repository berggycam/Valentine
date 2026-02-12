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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors self-start sm:self-center"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm sm:text-base">Back to Home</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-red-600 romantic-font text-center sm:text-left">
              {showDashboard ? 'My Proposals' : 'Valentine Proposal'}
            </h1>
            <div className="w-16 sm:w-20"></div>
          </div>
        </div>
      )}
    </>
  );
}
