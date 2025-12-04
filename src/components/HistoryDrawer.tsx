"use client";

import { HistoryBatch } from "@/types";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryBatch[];
  onSelectBatch: (batch: HistoryBatch) => void;
}

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelectBatch,
}: HistoryDrawerProps) {
  if (!isOpen) return null;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-[var(--surface)] shadow-xl drawer-enter">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold">Session History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-65px)]">
          {history.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📜</div>
              <div className="text-[var(--muted)]">No history yet</div>
              <div className="text-sm text-[var(--muted)] mt-1">
                Generated images will appear here
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((batch) => (
                <button
                  key={batch.id}
                  onClick={() => {
                    onSelectBatch(batch);
                    onClose();
                  }}
                  className="w-full text-left p-3 bg-[var(--background)] rounded-xl hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <div className="flex gap-2 mb-2 overflow-x-auto">
                    {batch.images.slice(0, 4).map((img, i) => (
                      <img
                        key={img.id}
                        src={img.url}
                        alt=""
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                    ))}
                    {batch.images.length > 4 && (
                      <div className="w-12 h-12 bg-[var(--surface)] rounded-lg flex items-center justify-center flex-shrink-0 text-sm text-[var(--muted)]">
                        +{batch.images.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium truncate">{batch.modelName}</div>
                  <div className="text-xs text-[var(--muted)] truncate mt-1">
                    {batch.prompt}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1">
                    {formatTime(batch.timestamp)} · {batch.images.length} images
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

