import React, { useState } from "react";
import { QuizQuestion } from "../types";
import { Volume2, Award, ClipboardCheck, Sparkles, BookOpen, AlertCircle, Play, ArrowRight, Loader2 } from "lucide-react";

interface QuizSandboxProps {
  questions: QuizQuestion[];
  onPlaySpeech: (text: string) => void;
  onGenerateModelAnswer: (prompt: string, id: string) => Promise<string>;
}

export const QuizSandbox: React.FC<QuizSandboxProps> = ({
  questions,
  onPlaySpeech,
  onGenerateModelAnswer
}) => {
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [checkedIds, setCheckedIds] = useState<{ [key: string]: boolean }>({});
  const [modelAnswers, setModelAnswers] = useState<{ [key: string]: string }>({});
  const [loadingModelId, setLoadingModelId] = useState<string | null>(null);

  const handleSelectAnswer = (id: string, option: string) => {
    setUserAnswers(prev => ({ ...prev, [id]: option }));
  };

  const handleCheckAnswer = (id: string) => {
    setCheckedIds(prev => ({ ...prev, [id]: true }));
  };

  const handleFetchModelAnswer = async (id: string, questionText: string) => {
    setLoadingModelId(id);
    try {
      const ans = await onGenerateModelAnswer(questionText, id);
      setModelAnswers(prev => ({ ...prev, [id]: ans }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingModelId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="bg-emerald-550 p-2.5 rounded-lg text-white">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 leading-normal">Oman Grade 12B Mock Sandbox</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans mt-0.5">
              Practice past Omani diploma exam questions with immediate feedback, model paragraphs, and spelling checks.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0 font-mono text-xs text-slate-500 bg-white px-3.5 py-2 rounded-lg border border-slate-100">
          <span>Objective Drills: <strong>10</strong></span>
          <span>Writing Portfolios: <strong>2</strong></span>
        </div>
      </div>

      <div className="space-y-5">
        {questions.map((q, idx) => {
          const isObjective = q.options !== undefined;
          const isWriting = !isObjective;
          const userAns = userAnswers[q.id];
          const isChecked = checkedIds[q.id];
          const isCorrect = userAns === q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`bg-white border rounded-xl p-5 transition-all relative overflow-hidden ${
                isWriting
                  ? "border-l-4 border-l-amber-500 border-slate-200"
                  : isChecked
                  ? isCorrect
                    ? "border-emerald-200 bg-emerald-50/20"
                    : "border-rose-200 bg-rose-50/20"
                  : "border-slate-200"
              }`}
            >
              {/* Context header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3.5">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> TASK {idx + 1} • {q.section}
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                  {q.sourceExam}
                </span>
              </div>

              {/* Optional Text block (Reading details) */}
              {q.text && (
                <p className="text-xs text-slate-650 bg-slate-50 border border-slate-100 rounded-lg p-3.5 leading-relaxed font-sans mb-4 max-w-3xl">
                  {q.text}
                </p>
              )}

              {/* Question display */}
              <div className="flex items-baseline gap-2.5 mb-4">
                <button
                  onClick={() => onPlaySpeech(q.question)}
                  title="Speak exercise outline out loud"
                  className="p-1.5 hover:text-emerald-600 rounded hover:bg-slate-100 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-slate-450" />
                </button>
                <h4 className="text-sm font-semibold text-slate-800 font-sans leading-relaxed">
                  {q.question}
                </h4>
              </div>

              {isObjective && q.options && (
                <div className="space-y-2 max-w-xl">
                  {q.options.map((opt) => {
                    const isSelected = userAns === opt;
                    const isOptCorrect = opt === q.correctAnswer;
                    
                    let btnStyle = "border-slate-200 bg-white hover:bg-slate-50 text-slate-700";
                    if (isSelected) {
                      btnStyle = "border-slate-800 bg-slate-800 text-white font-medium";
                    }
                    if (isChecked) {
                      if (isOptCorrect) {
                        btnStyle = "border-emerald-600 bg-emerald-600 text-white font-medium"; // Emerald highlighting for correct choice
                      } else if (isSelected) {
                        btnStyle = "border-rose-600 bg-rose-600 text-white font-medium"; // Pink/Red highlighting for erroneous selected answer
                      } else {
                        btnStyle = "border-slate-100 bg-slate-50 text-slate-350 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={opt}
                        disabled={isChecked}
                        onClick={() => handleSelectAnswer(q.id, opt)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isChecked && isOptCorrect && (
                          <span className="text-[10px] bg-emerald-500/25 text-white px-2 py-0.5 rounded-full font-bold">
                            CORRECT ANSWER
                          </span>
                        )}
                        {isChecked && isSelected && !isCorrect && (
                          <span className="text-[10px] bg-rose-500/25 text-white px-2 py-0.5 rounded-full font-bold">
                            INCORRECT
                          </span>
                        )}
                      </button>
                    );
                  })}

                  <div className="mt-4 flex gap-2">
                    {!isChecked ? (
                      <button
                        disabled={!userAns}
                        onClick={() => handleCheckAnswer(q.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-mono py-1.5 px-3 rounded-md transition-colors font-medium flex items-center gap-1"
                      >
                        Check Selection
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setCheckedIds(prev => {
                            const copy = { ...prev };
                            delete copy[q.id];
                            return copy;
                          });
                          setUserAnswers(prev => {
                            const copy = { ...prev };
                            delete copy[q.id];
                            return copy;
                          });
                        }}
                        className="hover:border-slate-350 text-slate-500 hover:text-slate-800 text-xs font-mono py-1.5 px-3 rounded-md border border-slate-200 transition-colors"
                      >
                        Reset Question
                      </button>
                    )}
                  </div>
                </div>
              )}

              {isWriting && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-500 leading-normal bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-start gap-2.5">
                    <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      This is an open constructive task requiring a <strong>100+ word essay</strong> format. Try outline drafting in private or utilize our high-grade AI Engine below to instantly see a perfect 10/10 Omani exam model text.
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFetchModelAnswer(q.id, q.question)}
                      disabled={loadingModelId !== null}
                      className="bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 text-xs font-mono font-medium py-1.5 px-3.5 rounded-lg flex items-center gap-2"
                    >
                      {loadingModelId === q.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> Generating via Gemini Pro...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Simulate Model Essay
                        </>
                      )}
                    </button>

                    {modelAnswers[q.id] && (
                      <button
                        onClick={() => {
                          setModelAnswers(prev => {
                            const copy = { ...prev };
                            delete copy[q.id];
                            return copy;
                          });
                        }}
                        className="text-xs font-mono border border-slate-200 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-700"
                      >
                        Clear Model
                      </button>
                    )}
                  </div>

                  {/* Render Model response */}
                  {modelAnswers[q.id] && (
                    <div className="bg-emerald-50/20 border border-emerald-100 rounded-xl p-5 space-y-3.5 animate-fade-in">
                      <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
                        <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
                          Oman Diploma Exemplary Model Answer (A1-B2 Level Alignment)
                        </span>
                      </div>
                      
                      <div className="text-slate-750 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                        {modelAnswers[q.id]}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
