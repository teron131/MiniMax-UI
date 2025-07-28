"use client";

import { Download, Mic, Pause, Play, Settings, Zap } from 'lucide-react';
import React, { useState } from 'react';

interface AudioFile {
  id: string;
  name: string;
  voice: string;
  duration: string;
  timestamp: string;
  url: string;
}

interface VoiceGeneratorProps {
  maxCharacters?: number;
  initialCredits?: number;
  voices?: Array<{ id: string; name: string; accent: string }>;
  audioFiles?: AudioFile[];
}

const VoiceGenerator: React.FC<VoiceGeneratorProps> = ({
  maxCharacters = 500,
  initialCredits = 1250,
  voices = [
    { id: 'sarah', name: 'Sarah', accent: 'American' },
    { id: 'james', name: 'James', accent: 'British' },
    { id: 'maria', name: 'Maria', accent: 'Spanish' },
    { id: 'alex', name: 'Alex', accent: 'Australian' },
    { id: 'emma', name: 'Emma', accent: 'Canadian' }
  ],
  audioFiles = [
    {
      id: '1',
      name: 'Welcome Message',
      voice: 'Sarah (American)',
      duration: '0:45',
      timestamp: '2 minutes ago',
      url: '#'
    },
    {
      id: '2',
      name: 'Product Description',
      voice: 'James (British)',
      duration: '1:23',
      timestamp: '15 minutes ago',
      url: '#'
    },
    {
      id: '3',
      name: 'Tutorial Intro',
      voice: 'Maria (Spanish)',
      duration: '0:32',
      timestamp: '1 hour ago',
      url: '#'
    }
  ]
}) => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('sarah');
  const [speed, setSpeed] = useState([1.0]);
  const [stability, setStability] = useState([0.75]);
  const [credits, setCredits] = useState(initialCredits);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<AudioFile[]>(audioFiles);

  const characterCount = text.length;
  const estimatedCredits = Math.ceil(characterCount / 10);

  const handleGenerate = async () => {
    if (!text.trim() || characterCount > maxCharacters) return;
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const selectedVoiceData = voices.find(v => v.id === selectedVoice);
      const newAudio: AudioFile = {
        id: Date.now().toString(),
        name: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
        voice: `${selectedVoiceData?.name} (${selectedVoiceData?.accent})`,
        duration: '0:' + Math.floor(Math.random() * 60).toString().padStart(2, '0'),
        timestamp: 'Just now',
        url: '#'
      };
      
      setGeneratedFiles(prev => [newAudio, ...prev]);
      setCredits(prev => prev - estimatedCredits);
      setIsGenerating(false);
      setText('');
    }, 2000);
  };

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Voice Generator</h1>
          <p className="text-muted-foreground">Transform your text into natural-sounding speech with advanced AI voices</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Text Input & Settings */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6 bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Mic className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Text to Speech</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <textarea
                    placeholder="Enter your text here to generate speech..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full min-h-[120px] p-3 border rounded-md resize-none bg-background"
                    maxLength={maxCharacters}
                  />
                  <div className="flex justify-between items-center text-sm">
                    <span className={`${characterCount > maxCharacters ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {characterCount}/{maxCharacters} characters
                    </span>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-muted-foreground">
                        Credits: <span className="font-semibold text-foreground">{credits}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="border-border" />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="h-4 w-4" />
                    <span className="font-medium">Voice Settings</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Voice</label>
                    <select 
                      value={selectedVoice} 
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      {voices.map((voice) => (
                        <option key={voice.id} value={voice.id}>
                          {voice.name} ({voice.accent})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Speed</label>
                      <span className="text-sm text-muted-foreground">{speed[0]}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={speed[0]}
                      onChange={(e) => setSpeed([parseFloat(e.target.value)])}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Stability</label>
                      <span className="text-sm text-muted-foreground">{Math.round(stability[0] * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={stability[0]}
                      onChange={(e) => setStability([parseFloat(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                <hr className="border-border" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Estimated cost:</span>
                    <span className="font-medium">{estimatedCredits} credits</span>
                  </div>
                  <button 
                    onClick={handleGenerate}
                    disabled={!text.trim() || characterCount > maxCharacters || isGenerating || credits < estimatedCredits}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Audio'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Generated Audio */}
          <div>
            <div className="border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-semibold mb-4">Generated Audio</h2>
              
              <div className="space-y-4">
                {generatedFiles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No audio files generated yet</p>
                    <p className="text-sm">Enter text and click generate to create your first audio</p>
                  </div>
                ) : (
                  generatedFiles.map((file) => (
                    <div key={file.id} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{file.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                              {file.voice}
                            </span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{file.duration}</span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{file.timestamp}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePlay(file.id)}
                          className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent"
                        >
                          {playingId === file.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                          {playingId === file.id ? 'Pause' : 'Play'}
                        </button>
                        
                        <button className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent">
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceGenerator; 