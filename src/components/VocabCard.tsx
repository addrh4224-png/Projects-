import React, { useState } from "react";
import { VocabWord } from "../types";
import { Volume2, Sparkles, Image as ImageIcon, Flame, Loader2 } from "lucide-react";

interface VocabCardProps {
  vocabList: VocabWord[];
  onPlaySpeech: (text: string) => void;
  onGenerateImage: (vocab: VocabWord, index: number) => void;
  isGeneratingImage: { [key: number]: boolean };
}

export const VocabCard: React.FC<VocabCardProps> = ({
  vocabList,
  onPlaySpeech,
  onGenerateImage,
  isGeneratingImage,
}) => {
  const [searchTerm, setSearchFilter] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("ALL");

  const filteredList = vocabList.filter((v) => {
    const matchesSearch =
      v.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.arabicTranslation.includes(searchTerm) ||
      v.definition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTier = tierFilter === "ALL" || v.priorityTier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-4">
      {/* Filtering Header bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <input
          type="text"
          placeholder="Filter vocabulary by english or translation..."
          value={searchTerm}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full sm:max-w-md px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto shrink-0">
          <span className="text-xs font-medium text-slate-500 font-mono">Tiers:</span>
          {["ALL", "Emergency", "Important", "Normal", "Low"].map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                tierFilter === tier
                  ? tier === "Emergency"
                    ? "bg-rose-600 text-white"
                    : tier === "Important"
                    ? "bg-amber-500 text-white"
                    : "bg-slate-800 text-white"
                  : "bg-slate-150 text-slate-650 hover:bg-slate-200"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of parsed vocabulary slots */}
      {filteredList.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 border border-slate-200/50 rounded-xl">
          <p className="text-slate-400 text-sm font-medium">No target vocabulary matches this selection filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          {filteredList.map((vocab, index) => {
            const isNationalTheme = vocab.isVision2040;
            return (
              <div
                key={`${vocab.word}-${index}`}
                className={`bg-white border rounded-xl p-5 flex flex-col justify-between transition-all duration-200 relative overflow-hidden group ${
                  vocab.priorityTier === "Emergency"
                    ? "border-rose-200 shadow-sm hover:border-rose-300"
                    : vocab.priorityTier === "Important"
                    ? "border-amber-200 shadow-sm hover:border-amber-300"
                    : "border-slate-200/60 shadow-xxs hover:border-emerald-200"
                }`}
              >
                {/* Top flags */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    {vocab.priorityTier === "Emergency" && (
                      <span className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-rose-100" /> EMERGENCY STUDY
                      </span>
                    )}
                    {vocab.priorityTier === "Important" && (
                      <span className="bg-amber-5 border border-amber-100 text-amber-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                        IMPORTANT REVIEW
                      </span>
                    )}
                    {isNationalTheme && (
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        Oman Vision 2040
                      </span>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold">
                    CEFR {vocab.cefr}
                  </span>
                </div>

                {/* Word display details */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between border-b border-slate-50 pb-2">
                    <h4 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{vocab.emoji}</span>
                      <span>{vocab.word}</span>
                    </h4>
                    <span className="text-sm font-semibold text-emerald-800 font-mono" dir="rtl">
                      {vocab.arabicTranslation}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed font-sans min-h-[40px]">
                    {vocab.definition}
                  </p>
                </div>

                {/* Score panel & image placeholders */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                    <div>
                      Occurrences: <strong className="text-slate-700 font-bold">{vocab.rawCount}</strong> ({vocab.percentage}%)
                    </div>
                    <div>
                      Weight score: <strong className="text-slate-800 font-bold">{vocab.weightedScore}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* TTS pronunciation Cheerbutton */}
                    <button
                      onClick={() => onPlaySpeech(vocab.word)}
                      title="Pronounce clearly using AI Voice"
                      className="p-2 text-slate-500 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* On-Demand Dual-Coding Image Creation trigger */}
                    <button
                      onClick={() => onGenerateImage(vocab, index)}
                      disabled={isGeneratingImage[index]}
                      title="Generate illustrative reference image (Dual Coding theory)"
                      className="p-2 text-slate-500 hover:text-emerald-605 bg-slate-50 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingImage[index] ? (
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      ) : (
                        <ImageIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Render generated illustration if exists */}
                {vocab.imageUrl && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-slate-150 h-44 bg-slate-50 relative group">
                    <img
                      src={vocab.imageUrl}
                      alt={vocab.word}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-3">
                      <span className="text-[10px] font-mono text-white/90 leading-tight">
                        🎨 Dual Coding Card • Generated by gemini-3.1-flash-image
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
