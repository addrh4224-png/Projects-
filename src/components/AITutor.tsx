import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Sparkles, Volume2, Mic, CheckCircle, Clock } from "lucide-react";

interface AITutorProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isSending: boolean;
  onPlaySpeech: (text: string) => void;
}

export const AITutor: React.FC<AITutorProps> = ({
  chatHistory,
  onSendMessage,
  isSending,
  onPlaySpeech,
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  // Modern speech-recognition trigger to capture live vocals
  const handleToggleVoiceMic = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Notice: Speech recognition is unsupported by this browser or restricted inside sandboxed layouts. Please open the applet in a new tab if issues trigger.");
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SpeechRec();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onresult = (e: any) => {
      const vocalText = e.results[0][0].transcript;
      if (vocalText) {
        setInputText(vocalText);
      }
    };

    rec.onerror = (err: any) => {
      console.warn("Speech Recognition Error:", err);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.start();
  };

  return (
    <div className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-sm h-[580px] flex flex-col justify-between">
      {/* Header bar */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-850">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 rounded-lg p-2 text-white">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-display font-semibold">Al-Mu’allim: English AI Tutor</h3>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              ONLINE • OMAN VISION 2040 MODULE
            </span>
          </div>
        </div>
      </div>

      {/* Messages layout */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50 scrollbar-thin">
        {chatHistory.length === 0 ? (
          <div className="text-center py-12 px-6 space-y-3.5 max-w-sm mx-auto">
            <h4 className="text-sm font-semibold text-slate-700">Ahlan wa Sahlan! Welcome! 👋</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              I am your AI study expert. Ask me to explain <strong>Reported Speech</strong>, verify a grammar structure, review Titanic vocabulary, or explain national vision goals!
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Change to Reported Speech: Ali said 'I am eating'",
                "Highlight obsolete words",
                "Explain environmental sustainability"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSendMessage(suggestion)}
                  className="bg-white hover:bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-lg text-[10px] text-slate-600 font-mono transition-colors text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatHistory.map((msg) => {
            const isAI = msg.sender === "ai";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isAI ? "self-start" : "ml-auto flex-row-reverse"}`}
              >
                <div
                  className={`p-4 rounded-xl text-xs font-sans leading-relaxed shadow-xxs relative group ${
                    isAI
                      ? "bg-white border border-slate-150 text-slate-800"
                      : "bg-slate-900 border border-slate-850 text-white"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {isAI && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onPlaySpeech(msg.text)}
                        title="Cheerfully speak answer out loud"
                        className="p-1 hover:text-emerald-600 bg-slate-50 rounded border border-slate-150 transition-colors"
                      >
                        <Volume2 className="w-3 h-3 text-slate-500" />
                      </button>
                    </div>
                  )}
                  <span className="block text-[9px] mt-2 text-slate-400 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {isSending && (
          <div className="flex gap-3 max-w-[80%] items-center text-slate-400 font-mono text-[10px] py-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            <span>Al-Mu’allim is formulating explanation...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-150 flex gap-2">
        <button
          type="button"
          onClick={handleToggleVoiceMic}
          className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
            isListening
              ? "bg-rose-50 border-rose-300 text-rose-600 animate-pulse"
              : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800"
          }`}
          title="Hold speaking (Speech to Text)"
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder={isListening ? "Listening process active..." : "Query your English tutor..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isSending}
          className="flex-1 px-3.5 py-2 hover:bg-slate-50 focus:bg-white text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="bg-slate-900 border border-slate-850 hover:bg-slate-800 disabled:opacity-40 text-white font-mono text-xs font-medium py-2 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all duration-150"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
