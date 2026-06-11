import React from "react";
import { Code, Play, RefreshCw, Cpu, Layers } from "lucide-react";

interface PythonIdeProps {
  weights: { [key: string]: number };
  onWeightChange: (section: string, value: number) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
  pythonCode: string;
}

export const PythonIde: React.FC<PythonIdeProps> = ({
  weights,
  onWeightChange,
  onRunSimulation,
  isSimulating,
  pythonCode,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs font-mono text-slate-400 ml-2">pipeline.py — Python Lemmatizer Engine</span>
        </div>
        <button
          onClick={onRunSimulation}
          disabled={isSimulating}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-mono text-xs font-medium py-1.5 px-3 rounded-md transition-colors"
        >
          {isSimulating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          RUN ANALYSIS
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Editor Area */}
        <div className="lg:col-span-7 bg-slate-950 p-4 font-mono text-[11px] text-slate-350 leading-relaxed overflow-x-auto max-h-[420px] overflow-y-auto border-r border-slate-800 select-all scrollbar-thin scrollbar-thumb-slate-800">
          <pre className="text-emerald-400">
            {`# OMEGA High-Octane Lemmatization & Priority Algorithm`}
          </pre>
          <pre className="text-slate-300">
            {`import re
from collections import Counter

# Section Importance Multipliers`}
          </pre>
          <pre className="text-amber-400">
            {`SECTION_WEIGHTS = {
  "LISTENING": ${weights.LISTENING},
  "READING": ${weights.READING},
  "VOCABULARY": ${weights.VOCABULARY},
  "GRAMMAR": ${weights.GRAMMAR},
  "WRITING": ${weights.WRITING}
}`}
          </pre>
          <pre className="text-slate-400">
            {`
# Oman Vision 2040 Contemporary Smart Boosters
CONTEXT_MULTIPLIER = 1.3

def lemmatize_linguistics(word):
    # Reducing variant terms to base representation
    # Preventing fragmentation of 'writes', 'writing', 'wrote'
    lemmas = { "writing": "write", "wrote": "write", "written": "write" }
    return lemmas.get(word.lower(), word.lower())

def calculate_priority(word_pct, section, is_national_theme=False):
    multiplier = CONTEXT_MULTIPLIER if is_national_theme else 1.0
    weight = SECTION_WEIGHTS.get(section, 1.0)
    
    # Mathematical Priority equation:
    w_score = (word_pct * weight) * multiplier
    return w_score
`}
          </pre>
          <div className="mt-4 text-slate-500 text-[10px] border-t border-slate-805 pt-2">
            * Full production-ready parsing code block is compiled in /pipeline.py at root.
          </div>
        </div>

        {/* Weights Console Control Panel */}
        <div className="lg:col-span-5 bg-slate-900 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Cpu className="w-4 h-4" /> Pipeline Calibration
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Alter segment coefficients below to calibrate the prioritization hierarchy. Highly weights boost urgent vocabulary.
            </p>

            <div className="space-y-3.5">
              {Object.keys(weights).map((sectionKey) => (
                <div key={sectionKey} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 font-medium">{sectionKey} Weight</span>
                    <span className="text-emerald-400 font-bold">{weights[sectionKey].toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={weights[sectionKey]}
                    onChange={(e) => onWeightChange(sectionKey, parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-4">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2.5">
              <Layers className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 block font-semibold">PREDICTIVE BOOSTER</span>
                <span className="text-xs text-slate-300 leading-normal">
                  Words mapping to <strong>Oman Vision 2040</strong> (AI, Climate, Sustainability) get a passive <strong>1.3x weight boost</strong>.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
