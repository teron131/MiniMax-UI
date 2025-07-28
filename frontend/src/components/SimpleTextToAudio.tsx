"use client";

import React, { useState } from 'react';

interface AudioResult {
  id: string;
  text: string;
  voice: string;
  timestamp: Date;
}

const SimpleTextToAudio: React.FC = () => {
  const [text, setText] = useState("Welcome to our AI-powered text-to-speech platform.");
  const [voice, setVoice] = useState("sarah");
  const [speed, setSpeed] = useState(1.0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<AudioResult[]>([]);

  const handleGenerate = () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const newResult: AudioResult = {
        id: Date.now().toString(),
        text: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
        voice: voice === "sarah" ? "Sarah" : voice === "marcus" ? "Marcus" : "Emma",
        timestamp: new Date()
      };
      
      setResults(prev => [newResult, ...prev]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            🎵 AI Voice Generator
          </h1>
          <p className="text-slate-300">Transform your text into natural-sounding speech with advanced AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="space-y-6">
              <div>
                <label htmlFor="text-input" className="block text-base font-semibold mb-3">
                  Text Input
                </label>
                <textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter the text you want to convert to speech..."
                  className="w-full min-h-[120px] p-3 bg-slate-900 border border-slate-600 rounded-md text-white placeholder-slate-400 resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-slate-400">
                    {text.length} characters
                  </span>
                  <span className="text-xs bg-slate-700 px-2 py-1 rounded">
                    {Math.ceil(text.length / 150)} credits
                  </span>
                </div>
              </div>

              <hr className="border-slate-600" />

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  ✨ Voice Settings
                </h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Voice</label>
                  <select 
                    value={voice} 
                    onChange={(e) => setVoice(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-600 rounded-md text-white"
                  >
                    <option value="sarah">Sarah - Professional Female</option>
                    <option value="marcus">Marcus - Deep Male</option>
                    <option value="emma">Emma - Warm Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Speed: {speed}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !text.trim()}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
              >
                {isGenerating ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Generating Audio...
                  </>
                ) : (
                  <>
                    🔊 Generate Audio
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-base mb-3">Generated Audio</h3>
                <p className="text-sm text-slate-400">
                  Your generated audio files will appear here
                </p>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {results.map((result) => (
                  <div key={result.id} className="p-4 bg-slate-900 border border-slate-600 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">{result.text}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="bg-slate-700 px-2 py-1 rounded text-xs">
                            {result.voice}
                          </span>
                          <span>•</span>
                          <span>1:23</span>
                          <span>•</span>
                          <span>Just now</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded border border-slate-600 transition-colors">
                          ▶️
                        </button>

                        <div className="flex-1 bg-slate-700 rounded-full h-2 relative overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full w-0 transition-all duration-300" />
                        </div>

                        <button className="px-3 py-1 text-slate-400 hover:text-white transition-colors">
                          📥
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {results.length === 0 && !isGenerating && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🎵</div>
                    <p className="text-slate-400">No audio generated yet</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Enter some text and click generate to get started
                    </p>
                  </div>
                )}

                {isGenerating && (
                  <div className="p-4 bg-slate-900 border border-dashed border-slate-600 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="animate-spin text-xl">⏳</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Generating audio...</p>
                        <p className="text-xs text-slate-400">This may take a few moments</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTextToAudio; 