import React from "react";

type Props = {
  isOpen: boolean;
  onAccept: () => void;
};

export default function DisclaimerModal({ isOpen, onAccept }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white max-w-lg w-full rounded-xl shadow-lg p-6 animate-in fade-in zoom-in duration-300">
        <h2 className="text-xl font-semibold mb-4">
          Important Notice – Practice Test
        </h2>

        <p className="text-sm text-gray-700 mb-3">
          This full mock test is a practice simulation designed to help PTE
          Academic test-takers become familiar with the test format and timing.
        </p>

        <p className="text-sm text-gray-700 mb-3">
          This is not an official PTE Academic test and is not endorsed by
          Pearson. Scores are indicative only and do not guarantee official
          results.
        </p>

        <p className="text-sm text-gray-700 mb-4">
          For migration or visa purposes, candidates must take the official test
          at an authorized PTE test centre.
        </p>

        <div className="flex justify-end">
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Start Full Mock Test
          </button>
        </div>
      </div>
    </div>
  );
}
