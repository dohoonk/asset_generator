"use client";

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  progress?: { current: number; total: number };
}

export default function GenerateButton({
  onClick,
  disabled,
  isLoading,
  progress,
}: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full py-4 px-6 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 shadow-lg shadow-[var(--primary)]/25"
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-3">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>
            {progress
              ? `Generating image ${progress.current} of ${progress.total}...`
              : "Generating..."}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">✨</span>
          <span>Generate Images</span>
        </div>
      )}
    </button>
  );
}

