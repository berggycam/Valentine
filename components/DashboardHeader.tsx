'use client';

interface DashboardHeaderProps {
  showDashboard: boolean;
  onTabChange: (showDashboard: boolean) => void;
}

export default function DashboardHeader({ showDashboard, onTabChange }: DashboardHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold text-red-600 mb-4 romantic-font">
        Valentine's Dashboard 💕
      </h1>
      <p className="text-gray-600 mb-6">
        Create proposals and track responses
      </p>
      
      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => onTabChange(false)}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            !showDashboard 
              ? 'bg-pink-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Create New Proposal
        </button>
        <button
          onClick={() => onTabChange(true)}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            showDashboard 
              ? 'bg-pink-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          View Responses
        </button>
      </div>
    </div>
  );
}
