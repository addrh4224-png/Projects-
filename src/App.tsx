import { useState, useEffect, useRef } from "react";
import { SAMPLE_EXAMS, AUTHENTIC_QUIZ, INITIAL_VOCAB } from "./data";
import { ParsingResult, VocabWord, ChatMessage } from "./types";
import { PythonIde } from "./components/PythonIde";
import { VocabCard } from "./components/VocabCard";
import { QuizSandbox } from "./components/QuizSandbox";
import { AITutor } from "./components/AITutor";
import {
  BookOpen, Sparkles, Cpu, Layers, Volume2, HelpCircle, FileText,
  Activity, Compass, Code, HighlightCon, Compass as CompassIcon,
  ChevronRight, RefreshCw, UploadCloud, Info, CheckCircle2, Languages
} from "lucide-react";

export default function App() {
  // State definitions aligned with types.ts
  const [selectedExamId, setSelectedExamId] = useState("mussa-experience-series-g12b");
  const [customText, setCustomText] = useState("");
  const [weights, setWeights] = useState<{ [key: string]: number }>({
    LISTENING: 1.4,
    READING: 1.2,
    VOCABULARY: 1.0,
    GRAMMAR: 0.9,
    WRITING: 0.8
  });

  const [vocabList, setVocabList] = useState<VocabWord[]>(INITIAL_VOCAB);
  const [sections, setSections] = useState<{ [key: string]: string[] }>({});
  const [summary, setSummary] = useState({
    totalWords: 345,
    uniqueWords: 24,
    emergencyCount: 3,
    averageCEFR: "B1"
  });

  const [activeTab, setActiveTab] = useState<"visualizer" | "vocab" | "quiz" | "tutor">("visualizer");
  const [highlightMode, setHighlightMode] = useState<"none" | "emergency" | "grammar" | "emerald">("none");
  const [currentPastedCorpus, setCurrentPastedCorpus] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceName, setVoiceName] = useState("Zephyr"); // Zephyr, Kore, Puck, Charon, Fenrir

  // Chat memory state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [generatingImagesIdx, setGeneratingImagesIdx] = useState<{ [key: number]: boolean }>({});

  // Sync Past Exam selection to text input or raw content
  useEffect(() => {
    const selected = SAMPLE_EXAMS.find(e => e.id === selectedExamId);
    if (selected) {
      setCustomText(selected.rawText.trim());
    } else {
      setCustomText("");
    }
  }, [selectedExamId]);

  // Initial trigger run of study guides
  useEffect(() => {
    handleRunAnalysis();
  }, []);

  // API Call: Trigger Full server-side clean, lemmatization, weights, and Oman 2040 multiplier
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: customText || SAMPLE_EXAMS[0].rawText })
      });
      const data: ParsingResult = await response.json();
      if (data.vocabList) {
        // Apply slider calibrations locally to computed scores
        const calibrated = data.vocabList.map(v => {
          const w = weights[v.lemma.toUpperCase()] || weights.VOCABULARY;
          const weightedScore = (v.percentage * w) * v.contextualMultiplier;
          let tier = "Normal";
          if (weightedScore >= 2.0 || (v.isVision2040 && v.percentage > 0.05)) {
            tier = "Emergency";
          } else if (weightedScore >= 1.0) {
            tier = "Important";
          } else if (weightedScore < 0.4) {
            tier = "Low";
          }
          return {
            ...v,
            sectionWeight: w,
            weightedScore: Number(weightedScore.toFixed(3)),
            priorityTier: tier
          };
        });

        // Re-sort
        calibrated.sort((a: any, b: any) => b.weightedScore - a.weightedScore);

        setVocabList(calibrated);
        setSections(data.sections);
        setSummary({
          totalWords: data.summary.totalWords,
          uniqueWords: calibrated.length,
          emergencyCount: calibrated.filter((c: any) => c.priorityTier === "Emergency").length,
          averageCEFR: data.summary.averageCEFR
        });
      }
    } catch (err) {
      console.error("Text parsing failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Callback: Interactive slider changes recompute priority values on-demand
  const handleWeightChange = (section: string, value: number) => {
    setWeights(prev => {
      const updated = { ...prev, [section]: value };
      // Recalculate vocab rankings immediately for fluid responsiveness
      setVocabList(currList => {
        const recomputed = currList.map(v => {
          // Identify which section this word primarily matches
          let w = updated.VOCABULARY;
          if (v.isVision2040) w = updated.VOCABULARY;
          const score = (v.percentage * w) * v.contextualMultiplier;
          let tier = "Normal";
          if (score >= 2.0 || (v.isVision2040 && v.percentage > 0.05)) {
            tier = "Emergency";
          } else if (score >= 1.0) {
            tier = "Important";
          } else if (score < 0.4) {
            tier = "Low";
          }
          return {
            ...v,
            sectionWeight: w,
            weightedScore: Number(score.toFixed(3)),
            priorityTier: tier
          };
        });
        return recomputed.sort((a, b) => b.weightedScore - a.weightedScore);
      });
      return updated;
    });
  };

  // API Call: Text-To-Speech Pronunciation with Gemini Voice Prebuilds
  const handlePlayTTS = async (text: string) => {
    // Attempt standard SpeechSynthesis immediately for offline performance first
    const playLocal = () => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    };

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: voiceName })
      });
      const data = await response.json();
      if (data.audio) {
        // Decode base64 pcm audio natively inside browser using clean context
        const audioBytes = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
        const blob = new Blob([audioBytes], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        const player = new Audio(url);
        player.play();
      } else {
        playLocal();
      }
    } catch (err) {
      console.warn("Gemini Speech Proxy down, falling back to domestic navigator SpeechSynthesis:", err);
      playLocal();
    }
  };

  // API Call: Create Dual-Coding illustrative image using gemini-3.1-flash-image-preview
  const handleGenerateImage = async (vocab: VocabWord, index: number) => {
    setGeneratingImagesIdx(prev => ({ ...prev, [index]: true }));
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: vocab.imagePrompt })
      });
      const data = await response.json();
      if (data.imageUrl) {
        setVocabList(prev => prev.map((v, idx) => idx === index ? { ...v, imageUrl: data.imageUrl } : v));
      }
    } catch (err) {
      console.error("Image generation trigger issue:", err);
    } finally {
      setGeneratingImagesIdx(prev => ({ ...prev, [index]: False }));
    }
  };

  // API Call: Multi-turn chat assistant query
  const handleSendChatMessage = async (userText: string) => {
    if (!userText.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsSendingChat(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: [...chatHistory, userMsg] })
      });
      const data = await response.json();
      if (data.reply) {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, aiMsg]);
        // Pronounce answer if very short
        if (data.reply.length < 150) {
          handlePlayTTS(data.reply);
        }
      }
    } catch (err) {
      console.error("Chat agent query failure:", err);
    } finally {
      setIsSendingChat(false);
    }
  };

  // API Call: Pro-Engine Model Writing response fetchers
  const handleGenerateModelWriting = async (prompt: string, qId: string): Promise<string> => {
    try {
      const response = await fetch("/api/generate-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: qId.startsWith("w-p") ? "story" : "email" })
      });
      const data = await response.json();
      return data.text || "Model response creation failed.";
    } catch (err: any) {
      return `Error generating writing from standard server: ${err.message}`;
    }
  };

  // Color text range highlights matching OMEGA directives
  const renderHighlightedReadingContent = () => {
    const text = `The advancement of wearable tech and digital sustainability has been a major topic in Oman Vision 2040. 

Ali said to me: “We must recycle obsolete phones because throwing them away destroys the natural environment.” 
Fortunately, the Omani government has built high-speed clean energy solar panels to protect our climate.
Reporter completed: "The Titanic, once the biggest passenger ship list, unfortunately hit a giant iceberg during its first voyage on 10 April 1912 and sank."`;

    if (highlightMode === "none") {
      return <p className="whitespace-pre-line text-sm text-slate-700 leading-relaxed font-sans">{text}</p>;
    }

    // Split words or highlight by phrases elegantly
    const sentences = text.split("\n");
    return (
      <div className="space-y-3 whitespace-pre-line text-sm leading-relaxed font-sans">
        {sentences.map((sentence, sIdx) => {
          let elements: React.ReactNode[] = [];
          let currentStr = sentence;

          // Target phrases for highlighting mapping
          const targets = [
            // Pink/Red: Emergency/Predictive items
            { pattern: /oman vision 2040/gi, className: "highlight-pink px-1 rounded font-bold font-display" },
            { pattern: /obsolete/gi, className: "highlight-pink px-1 rounded font-bold" },
            { pattern: /wearable tech/gi, className: "highlight-pink px-1 rounded font-bold" },
            { pattern: /iceberg/gi, className: "highlight-pink px-1 rounded font-bold" },
            { pattern: /sank/gi, className: "highlight-pink px-1 rounded" },
            
            // Amber/Yellow: Grammar, logical connectors, and transition markers
            { pattern: /ali said to me/gi, className: "highlight-amber px-1 rounded italic font-medium" },
            { pattern: /we must/gi, className: "highlight-amber px-1 rounded font-medium" },
            { pattern: /fortunately/gi, className: "highlight-amber px-1.5 rounded font-mono font-semibold" },
            { pattern: /because/gi, className: "highlight-amber px-1 rounded font-medium" },
            
            // Emerald/Green: Acquired terms, successfully resolved markers
            { pattern: /digital sustainability/gi, className: "highlight-emerald px-1 rounded font-medium font-semibold" },
            { pattern: /recycle/gi, className: "highlight-emerald px-1 rounded font-medium" },
            { pattern: /protect/gi, className: "highlight-emerald px-1 rounded" },
            { pattern: /clean energy/gi, className: "highlight-emerald px-1 rounded font-semibold" }
          ];

          // Simple parsing logic: finding indices of matches, wrapping them, or keeping plain text
          // To keep it rugged and bug-free, we match high-yield items directly based on active highlights
          let contentNode: React.ReactNode = sentence;

          if (highlightMode === "emergency") {
            // Only highlight pinks
            const emergencyItems = ["Oman Vision 2040", "obsolete", "wearable tech", "iceberg", "sank"];
            contentNode = sentence.split(new RegExp(`(${emergencyItems.join("|")})`, "gi")).map((chunk, cIdx) => {
              if (emergencyItems.some(i => i.toLowerCase() === chunk.toLowerCase())) {
                return <span key={cIdx} className="highlight-pink px-1 rounded font-bold font-display">{chunk}</span>;
              }
              return chunk;
            });
          } else if (highlightMode === "grammar") {
            const grammarItems = ["Ali said to me", "we must", "Fortunately", "because"];
            contentNode = sentence.split(new RegExp(`(${grammarItems.join("|")})`, "gi")).map((chunk, cIdx) => {
              if (grammarItems.some(i => i.toLowerCase() === chunk.toLowerCase())) {
                return <span key={cIdx} className="highlight-amber px-1 rounded font-mono font-medium">{chunk}</span>;
              }
              return chunk;
            });
          } else if (highlightMode === "emerald") {
            const greenItems = ["digital sustainability", "recycle", "protect", "clean energy"];
            contentNode = sentence.split(new RegExp(`(${greenItems.join("|")})`, "gi")).map((chunk, cIdx) => {
              if (greenItems.some(i => i.toLowerCase() === chunk.toLowerCase())) {
                return <span key={cIdx} className="highlight-emerald px-1 rounded font-semibold">{chunk}</span>;
              }
              return chunk;
            });
          }

          return <p key={sIdx}>{contentNode}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top clean head bar */}
      <header className="bg-white border-b border-slate-100 px-6 py-4.5 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2.5 rounded-xl flex items-center justify-center font-display font-bold text-lg leading-none shrink-0 shadow-md shadow-emerald-500/10 glow-pulse">
              OM
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-slate-900 tracking-tight flex items-center gap-2">
                OmanExam AI <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-mono font-bold">12B Study Kit</span>
              </h1>
              <p className="text-xs text-slate-500 font-sans mt-0.5 max-w-sm sm:max-w-md">
                NLP Lemmatizer & Prioritization Suite aligned with Oman Vision 2040 academic goals.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            {/* Custom Voice selector */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-250/50">
              <span className="text-xs font-mono text-slate-400">Oral Voice:</span>
              <select
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-mono font-bold focus:outline-none border-none py-0 cursor-pointer"
              >
                <option value="Zephyr">⚡ Zephyr (Expressive)</option>
                <option value="Kore">✨ Kore (Balanced)</option>
                <option value="Puck">🔔 Puck (Cheerful)</option>
                <option value="Charon">🎓 Charon (Academic)</option>
                <option value="Fenrir">🦁 Fenrir (Deep)</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left column: Controls and corpora select */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-slate-150 p-5 space-y-4.5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-display font-bold text-slate-900 uppercase tracking-wide">Exam Dataset</h2>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Choose an authentic high-school past paper to parse and lemmatize, or paste custom raw curriculum texts below.
            </p>

            <div className="space-y-2">
              {SAMPLE_EXAMS.map(exam => {
                const isActive = selectedExamId === exam.id;
                return (
                  <button
                    key={exam.id}
                    onClick={() => setSelectedExamId(exam.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "border-emerald-500 bg-emerald-50/20 text-slate-900"
                        : "border-slate-200/50 bg-slate-50 hover:bg-slate-100 text-slate-650"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold block leading-tight">{exam.title}</span>
                      <span className="text-[10px] text-slate-450 block truncate max-w-[245px]">{exam.description}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-emerald-600 translate-x-1" : "text-slate-350"}`} />
                  </button>
                );
              })}
            </div>

            {/* Custom textarea block */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-700 block font-mono">Custom Input Text Draft:</span>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={5}
                placeholder="Paste any English test questions, reading descriptions, or vocabulary list chapters here..."
                className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-205 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full bg-emerald-600 hover:bg-emerald-555 text-white font-mono text-xs font-semibold uppercase tracking-wider py-2.5 rounded-xl border-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm hover:shadow-md"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" /> Loading Lemmas...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" /> Analyse Past Paper
                </>
              )}
            </button>
          </div>

          {/* NLP Summary Panel */}
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 text-white space-y-4">
            <h3 className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> Analysis Feed Console
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-450 block uppercase tracking-wider font-mono">Processed Words</span>
                <span className="text-xl font-bold font-display text-emerald-400">{summary.totalWords}</span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-450 block uppercase tracking-wider font-mono">Unique Lemmatized</span>
                <span className="text-xl font-bold font-display text-emerald-400">{summary.uniqueWords}</span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-450 block uppercase tracking-wider font-mono">CEFR Alignment</span>
                <span className="text-xl font-bold font-display text-emerald-400">Grade {summary.averageCEFR}</span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-450 block uppercase tracking-wider font-mono">Emergency Alert</span>
                <span className="text-xl font-bold font-display text-rose-500">{summary.emergencyCount} words</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-850 leading-relaxed font-sans">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Standardization clears duplicate spelling iterations and lemmatizes inflections (e.g. <em>writes, wrote</em> → <strong>write</strong>) for pure metric accuracy.
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Main Dashboard workspace */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Visual highlighting toolbox */}
          <div className="bg-white rounded-xl border border-slate-150 p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display font-bold text-slate-900">Custom Text Highlight sandbox</h3>
              </div>
              
              {/* Highlight triggers */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-mono text-slate-400">Highlights:</span>
                <button
                  onClick={() => setHighlightMode("none")}
                  className={`px-3 py-1 rounded text-xs font-mono ${highlightMode === "none" ? "bg-slate-800 text-white font-medium" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  Clear
                </button>
                <button
                  onClick={() => setHighlightMode("emergency")}
                  className={`px-3 py-1 rounded text-xs font-mono ${highlightMode === "emergency" ? "bg-rose-600 text-white font-medium" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  🔴 Predictive
                </button>
                <button
                  onClick={() => setHighlightMode("grammar")}
                  className={`px-3 py-1 rounded text-xs font-mono ${highlightMode === "grammar" ? "bg-amber-500 text-white font-medium" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  🟡 Connectors
                </button>
                <button
                  onClick={() => setHighlightMode("emerald")}
                  className={`px-3 py-1 rounded text-xs font-mono ${highlightMode === "emerald" ? "bg-emerald-600 text-white font-medium" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  🟢 Vocab
                </button>
              </div>
            </div>

            {/* Simulated CSS Custom Highlight text layout */}
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-4.5 relative overflow-hidden">
              {renderHighlightedReadingContent()}
            </div>
          </div>

          {/* Navigation tab bars */}
          <div className="flex border-b border-slate-200 overflow-x-auto select-none no-scrollbar">
            {[
              { id: "visualizer", label: "Python NLP IDE", icon: Code },
              { id: "vocab", label: "Interactive Vocabulary Study Guide", icon: Cpu },
              { id: "quiz", label: "Exam Sandbox & Drills", icon: HelpCircle },
              { id: "tutor", label: "Al-Mu’allim AI Tutor", icon: Sparkles }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-5 border-b-2 font-display text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? "border-emerald-600 text-emerald-600 font-bold bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tabs Workspace content renders */}
          <div className="space-y-4">
            {activeTab === "visualizer" && (
              <PythonIde
                weights={weights}
                onWeightChange={handleWeightChange}
                onRunSimulation={handleRunAnalysis}
                isSimulating={isAnalyzing}
                pythonCode=""
              />
            )}

            {activeTab === "vocab" && (
              <VocabCard
                vocabList={vocabList}
                onPlaySpeech={handlePlayTTS}
                onGenerateImage={handleGenerateImage}
                isGeneratingImage={generatingImagesIdx}
              />
            )}

            {activeTab === "quiz" && (
              <QuizSandbox
                questions={AUTHENTIC_QUIZ}
                onPlaySpeech={handlePlayTTS}
                onGenerateModelAnswer={handleGenerateModelWriting}
              />
            )}

            {activeTab === "tutor" && (
              <AITutor
                chatHistory={chatHistory}
                onSendMessage={handleSendChatMessage}
                isSending={isSendingChat}
                onPlaySpeech={handlePlayTTS}
              />
            )}
          </div>

        </div>

      </main>

      {/* Footer credits omitting any telemetry logs or container jargon */}
      <footer className="bg-white border-t border-slate-100 py-6 px-6 mt-12 text-center text-xs text-slate-450 font-sans leading-relaxed">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-2 justify-between items-center">
          <p>
            © 2026 OmanExam AI Project. Supporting <strong>Oman Vision 2040 Strategic Milestones</strong>.
          </p>
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span>Dual Coding Pedagogy Built-in</span>
            <span>powered by Gemini 3.1 Pro & Flash Models</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
