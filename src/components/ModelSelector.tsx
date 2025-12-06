"use client";

import { useState, useRef, useEffect } from "react";
import { Model } from "@/types";

interface ModelSelectorProps {
  selectedModel: Model;
  onSelect: (model: Model) => void;
  models: Model[];
}

export default function ModelSelector({ selectedModel, onSelect, models }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredModel, setHoveredModel] = useState<Model | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case "fast":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "slow":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
        Select Model
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-left flex items-center justify-between hover:border-[var(--primary)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎨</span>
          <div>
            <div className="font-medium">{selectedModel.name}</div>
            <div className="text-sm text-[var(--muted)]">{selectedModel.style}</div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden animate-fade-in">
          <div className="max-h-80 overflow-y-auto">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onSelect(model);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHoveredModel(model)}
                onMouseLeave={() => setHoveredModel(null)}
                className={`w-full px-4 py-3 text-left hover:bg-[var(--surface-hover)] transition-colors flex items-center justify-between ${
                  selectedModel.id === model.id ? "bg-[var(--primary)]/10" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium">{model.name}</div>
                    <div className="text-sm text-[var(--muted)]">{model.style}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getSpeedColor(model.speed)}`}>
                  {model.speed}
                </span>
              </button>
            ))}
          </div>
          
          {/* Tooltip */}
          {hoveredModel && (
            <div className="border-t border-[var(--border)] p-3 bg-[var(--surface-hover)]">
              <div className="text-sm font-medium">{hoveredModel.name}</div>
              <div className="text-sm text-[var(--muted)] mt-1">{hoveredModel.description}</div>
              <div className="flex gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getSpeedColor(hoveredModel.speed)}`}>
                  {hoveredModel.speed}
                </span>
                {hoveredModel.supportsImage && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    Supports image input
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}





