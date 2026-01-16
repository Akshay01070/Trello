export default function BoardTopBar({ title = "Board", onToggleViews = () => {}, onOpenFilter = () => {} }) {
  return (
    <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-white/10 backdrop-blur-sm border-b border-white/10 sticky top-14 z-30">
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        <div className="text-sm sm:text-base md:text-lg font-medium text-white truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
          {title}
        </div>
        
        <button 
          title="Board visibility" 
          className="p-1 sm:p-1.5 rounded hover:bg-white/20 transition-colors flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <div 
          title="Members" 
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs sm:text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
        >
          AS
        </div>

        {/* Hide on mobile, show on tablet+ */}
        <button 
          title="Power-Up" 
          className="hidden sm:flex p-1.5 rounded hover:bg-white/20 transition-colors text-white flex-shrink-0"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>

        {/* Hide on mobile, show on tablet+ */}
        <button 
          title="Automation" 
          className="hidden sm:flex p-1.5 rounded hover:bg-white/20 transition-colors text-white flex-shrink-0"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>

        <button 
          title="Filter" 
          onClick={onOpenFilter} 
          className="p-1 sm:p-1.5 rounded hover:bg-white/20 transition-colors text-white flex-shrink-0"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Hide on small mobile, show on mobile+ */}
        <button 
          title="Star board" 
          className="hidden xs:flex p-1 sm:p-1.5 rounded hover:bg-white/20 transition-colors text-yellow-400 flex-shrink-0"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>

        {/* Hide on mobile, show on tablet+ */}
        <button 
          title="Show board members" 
          className="hidden md:flex p-1.5 rounded hover:bg-white/20 transition-colors text-white flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>

        <button 
          title="Share" 
          className="px-2 py-1 sm:px-3 sm:py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-1.5 flex-shrink-0"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden xs:inline">Share</span>
        </button>

        <button 
          title="More options" 
          className="p-1 sm:p-1.5 rounded hover:bg-white/20 transition-colors text-white flex-shrink-0"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}