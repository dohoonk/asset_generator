"use client";

import { useState } from "react";

interface PromptInputProps {
  prompt: string;
  negativePrompt: string;
  onPromptChange: (prompt: string) => void;
  onNegativePromptChange: (prompt: string) => void;
}

export default function PromptInput({
  prompt,
  negativePrompt,
  onPromptChange,
  onNegativePromptChange,
}: PromptInputProps) {
  const [showNegative, setShowNegative] = useState(false);

  const examplePrompts = [
    "a beautiful anime girl with long silver hair, cherry blossoms falling",
    "epic anime battle scene, dynamic lighting, magical effects",
    "peaceful Japanese countryside, studio ghibli style, summer afternoon",
    "cyberpunk anime city at night, neon lights, rain",
  ];

  const insertExample = (example: string) => {
    onPromptChange(example);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
          Describe your image
        </label>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="A beautiful anime character standing in a field of flowers..."
          className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl resize-none h-28 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--muted)]"
          maxLength={2000}
        />
        <div className="flex justify-between items-center mt-1">
          <div className="flex gap-1 flex-wrap">
            {examplePrompts.slice(0, 2).map((example, i) => (
              <button
                key={i}
                onClick={() => insertExample(example)}
                className="text-xs text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline"
              >
                Example {i + 1}
              </button>
            ))}
          </div>
          <span className="text-xs text-[var(--muted)]">{prompt.length}/2000</span>
        </div>
      </div>

      <button
        onClick={() => setShowNegative(!showNegative)}
        className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-1 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${showNegative ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Negative prompt (optional)
      </button>

      {showNegative && (
        <div className="animate-fade-in">
          <textarea
            value={negativePrompt}
            onChange={(e) => onNegativePromptChange(e.target.value)}
            placeholder="Things to avoid: blurry, low quality, bad anatomy..."
            className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl resize-none h-20 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--muted)]"
          />
        </div>
      )}
    </div>
  );
}

