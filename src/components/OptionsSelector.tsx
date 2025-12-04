"use client";

import { Dimension, DIMENSIONS } from "@/types";

interface OptionsSelectorProps {
  dimension: Dimension;
  batchCount: number;
  onDimensionChange: (dimension: Dimension) => void;
  onBatchCountChange: (count: number) => void;
}

export default function OptionsSelector({
  dimension,
  batchCount,
  onDimensionChange,
  onBatchCountChange,
}: OptionsSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
          Image Size
        </label>
        <select
          value={`${dimension.width}x${dimension.height}`}
          onChange={(e) => {
            const [w, h] = e.target.value.split("x").map(Number);
            const dim = DIMENSIONS.find((d) => d.width === w && d.height === h);
            if (dim) onDimensionChange(dim);
          }}
          className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 0.75rem center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1.5em 1.5em",
          }}
        >
          {DIMENSIONS.map((dim) => (
            <option key={dim.label} value={`${dim.width}x${dim.height}`}>
              {dim.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
          Number of Images
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onBatchCountChange(Math.max(1, batchCount - 1))}
            disabled={batchCount <= 1}
            className="w-10 h-10 flex items-center justify-center bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            −
          </button>
          <span className="w-12 text-center font-semibold text-lg">{batchCount}</span>
          <button
            onClick={() => onBatchCountChange(Math.min(10, batchCount + 1))}
            disabled={batchCount >= 10}
            className="w-10 h-10 flex items-center justify-center bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

