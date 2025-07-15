import React from "react";
import Image from "next/image";
import { useState } from "react";

interface Episode {
  number: number;
  title: string;
  filler: boolean;
  recap: boolean;
}

interface AnimeDetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  image: string;
  synopsis: string;
  episodes: Episode[];
  type?: string;
  score?: number;
  status?: string;
  aired?: string;
}

// Helper to group consecutive episodes by type
function groupEpisodes(episodes: Episode[]) {
  if (!episodes.length) return [];
  const groups = [];
  let start = 0;
  let currentType = getEpType(episodes[0]);
  for (let i = 1; i <= episodes.length; i++) {
    const type = i < episodes.length ? getEpType(episodes[i]) : '';
    if (type !== currentType) {
      groups.push({
        type: currentType,
        start: episodes[start].number,
        end: episodes[i - 1].number,
        episodes: episodes.slice(start, i),
      });
      start = i;
      currentType = type;
    }
  }
  return groups;
}

function getEpType(ep: Episode) {
  if (ep.filler) return "Filler";
  if (ep.recap) return "Recap";
  // Add logic for "Mostly Filler" or "Mixed" if needed
  return "Canon";
}

const typeToTag = {
  Canon: { label: "Canon", color: "green" },
  Filler: { label: "Filler", color: "red" },
  Recap: { label: "Recap", color: "blue" },
  "Mostly Filler": { label: "Mostly Filler", color: "red" },
  Mixed: { label: "Mixed", color: "yellow" },
};

export default function AnimeDetailModal({ open, onClose, title, image, synopsis, episodes, type, score, status, aired }: AnimeDetailModalProps) {
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  if (!open) return null;

  // Breakdown counts
  const canonCount = episodes.filter(ep => !ep.filler && !ep.recap).length;
  const fillerCount = episodes.filter(ep => ep.filler).length;
  const mixedCount = 0; // If you have mixed logic, update here
  const totalCount = episodes.length;

  // Watch Guide: group consecutive episodes by type
  const episodeGroups = groupEpisodes(episodes);

  // Modal layout
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] p-10 relative flex flex-col overflow-y-auto">
        <button
          className="absolute top-6 right-8 text-gray-400 hover:text-gray-700 text-3xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex flex-col md:flex-row gap-10 mb-8">
          <div className="relative w-48 h-64 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
            <Image
              src={image}
              alt={title}
              fill
              sizes="192px"
              className="object-cover rounded-xl"
              style={{ imageRendering: 'auto' }}
              priority={true}
              unoptimized
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">{title}</h2>
            <p className="text-gray-600 text-base mb-2">{synopsis}</p>
            <div className="flex flex-wrap gap-4 text-sm mb-2">
              <span className="font-semibold text-gray-700">Score: <span className="text-amber-500 font-bold">{score ?? '--'}</span></span>
              <span className="font-semibold text-gray-700">{totalCount} Episode{totalCount !== 1 ? 's' : ''}</span>
              <span className="font-semibold text-gray-700">Status: <span className="text-gray-500">{status}</span></span>
              <span className="font-semibold text-gray-700">Type: <span className="text-gray-500">{type}</span></span>
              <span className="font-semibold text-gray-700">Aired: <span className="text-gray-500">{aired}</span></span>
            </div>
          </div>
        </div>

        {/* Canon vs. Filler Breakdown */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Canon vs. Filler Breakdown</h3>
          <div className="h-1 w-full bg-gray-100 rounded mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center">
              <span className="text-3xl font-bold text-green-500">{canonCount}</span>
              <span className="mt-2 text-gray-600 font-semibold tracking-wide">CANON</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center">
              <span className="text-3xl font-bold text-red-500">{fillerCount}</span>
              <span className="mt-2 text-gray-600 font-semibold tracking-wide">FILLER</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center">
              <span className="text-3xl font-bold text-yellow-500">{mixedCount}</span>
              <span className="mt-2 text-gray-600 font-semibold tracking-wide">MIXED</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center">
              <span className="text-3xl font-bold text-gray-900">{totalCount}</span>
              <span className="mt-2 text-gray-600 font-semibold tracking-wide">TOTAL</span>
            </div>
          </div>
        </div>

        {/* Watch Guide */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Watch Guide</h3>
          <div className="text-gray-500 mb-4 text-sm bg-gray-50 rounded-xl px-6 py-3 border-l-4 border-violet-400">Follow this guide to watch only the essential episodes:</div>
          <div className="flex flex-col gap-4">
            {episodeGroups.map((group, idx) => {
              const tag = (typeToTag as Record<string, { label: string; color: string }>)[group.type] || { label: group.type, color: "gray" };
              const isWatch = group.type === "Canon";
              const isOpen = openGroup === idx;
              return (
                <div key={idx} className="bg-gray-50 rounded-xl px-6 py-4"> 
                  <button
                    className="flex items-center w-full text-left gap-4 focus:outline-none"
                    onClick={() => setOpenGroup(isOpen ? null : idx)}
                  >
                    <span className="text-lg font-bold text-gray-700 flex items-center gap-2">
                      {isWatch ? (
                        // AnimeSkip logo icon (from Header)
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-skip-forward inline-block mr-1"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" x2="19" y1="5" y2="19"></line></svg>
                      ) : (
                        // Double triangle (cc/skip) icon
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1"><polygon points="3 4 13 12 3 20 3 4"></polygon><polygon points="11 4 21 12 11 20 11 4"></polygon></svg>
                      )}
                      {isWatch ? 'Watch' : 'Skip'}
                    </span>
                    <span className="font-mono text-base font-semibold text-gray-800">
                      Episodes {group.start}{group.start !== group.end ? `-${group.end}` : ''}
                    </span>
                    <span className="text-gray-500 text-sm">({group.episodes.length} episode{group.episodes.length !== 1 ? 's' : ''})</span>
                    <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold bg-${tag.color}-100 text-${tag.color}-600`}>{tag.label}</span>
                    <svg className={`ml-2 w-5 h-5 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                  </button>
                  {isOpen && (
                    <div className="mt-3 border-t border-gray-200 pt-3">
                      <ul className="space-y-2">
                        {group.episodes.map(ep => (
                          <li key={ep.number} className="flex items-center gap-3">
                            <span className="font-mono text-gray-700">Ep. {ep.number}</span>
                            <span className="text-gray-700">{ep.title}</span>
                            <span className={`ml-auto px-2 py-0.5 rounded text-xs font-bold bg-${typeToTag[getEpType(ep)]?.color || 'gray'}-100 text-${typeToTag[getEpType(ep)]?.color || 'gray'}-600`}>
                              {typeToTag[getEpType(ep)]?.label || getEpType(ep)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Episode List */}
        <div className="overflow-x-auto border-t border-gray-100 pt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Full Episode List</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500">
                <th className="text-left font-semibold">#</th>
                <th className="text-left font-semibold">Title</th>
                <th className="text-left font-semibold">Type</th>
              </tr>
            </thead>
            <tbody>
              {episodes.map((ep) => (
                <tr key={ep.number} className="border-b border-gray-50 last:border-0">
                  <td className="py-1 pr-2 text-gray-700 font-mono">{ep.number}</td>
                  <td className="py-1 pr-2 text-gray-700">{ep.title}</td>
                  <td className="py-1">
                    {ep.filler ? (
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-600 font-semibold">Filler</span>
                    ) : ep.recap ? (
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-600 font-semibold">Recap</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-green-100 text-green-600 font-semibold">Canon</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 