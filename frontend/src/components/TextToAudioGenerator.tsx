"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { AudioWaveform, Download, Pause, Play, Sparkles, Volume2 } from 'lucide-react';
import React, { useState } from 'react';

interface AudioGenerationResult {
  id: string;
  prompt: string;
  audioUrl: string;
  duration: number;
  voice: string;
  timestamp: Date;
}

interface GenerationSettings {
  voice: string;
  speed: number;
  pitch: number;
  stability: number;
}

const TextToAudioGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("Welcome to our AI-powered text-to-speech platform. Experience natural, human-like voice generation with advanced neural networks.");
  const [settings, setSettings] = useState<GenerationSettings>({
    voice: "sarah",
    speed: 1.0,
    pitch: 1.0,
    stability: 0.8
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [results, setResults] = useState<AudioGenerationResult[]>([
    {
      id: "1",
      prompt: "Welcome to our AI-powered text-to-speech platform...",
      audioUrl: "#",
      duration: 12,
      voice: "Sarah",
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: "2", 
      prompt: "The future of voice synthesis is here with cutting-edge technology...",
      audioUrl: "#",
      duration: 18,
      voice: "Marcus",
      timestamp: new Date(Date.now() - 600000)
    }
  ]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newResult: AudioGenerationResult = {
        id: Date.now().toString(),
        prompt: prompt.substring(0, 50) + (prompt.length > 50 ? "..." : ""),
        audioUrl: "#",
        duration: Math.floor(Math.random() * 30) + 10,
        voice: settings.voice === "sarah" ? "Sarah" : settings.voice === "marcus" ? "Marcus" : "Emma",
        timestamp: new Date()
      };
      
      setResults(prev => [newResult, ...prev]);
      setIsGenerating(false);
    }, 3000);
  };

  const togglePlayback = (id: string) => {
    setCurrentlyPlaying(currentlyPlaying === id ? null : id);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <AudioWaveform className="h-8 w-8 text-primary" />
            AI Voice Generator
          </h1>
          <p className="text-muted-foreground">Transform your text into natural-sounding speech with advanced AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card className="p-6 bg-card border-border">
            <div className="space-y-6">
              <div>
                <Label htmlFor="prompt" className="text-base font-semibold mb-3 block">
                  Text Input
                </Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter the text you want to convert to speech..."
                  className="min-h-[120px] resize-none bg-background border-border"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">
                    {prompt.length} characters
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {Math.ceil(prompt.length / 150)} credits
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Voice Settings
                </h3>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">Voice</Label>
                  <Select value={settings.voice} onValueChange={(value: string) => setSettings(prev => ({ ...prev, voice: value }))}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah - Professional Female</SelectItem>
                      <SelectItem value="marcus">Marcus - Deep Male</SelectItem>
                      <SelectItem value="emma">Emma - Warm Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Speed: {settings.speed}x
                  </Label>
                  <Slider
                    value={[settings.speed]}
                    onValueChange={(value: number[]) => setSettings(prev => ({ ...prev, speed: value[0] }))}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Stability: {Math.round(settings.stability * 100)}%
                  </Label>
                  <Slider
                    value={[settings.stability]}
                    onValueChange={(value: number[]) => setSettings(prev => ({ ...prev, stability: value[0] }))}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full h-12 text-base font-medium"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                    Generating Audio...
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Generate Audio
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Results Panel */}
          <Card className="p-6 bg-card border-border">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-base mb-3">Generated Audio</h3>
                <p className="text-sm text-muted-foreground">
                  Your generated audio files will appear here
                </p>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {results.map((result) => (
                  <Card key={result.id} className="p-4 bg-background border-border">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">{result.prompt}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {result.voice}
                            </Badge>
                            <span>•</span>
                            <span>{formatDuration(result.duration)}</span>
                            <span>•</span>
                            <span>{formatTimestamp(result.timestamp)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePlayback(result.id)}
                          className="flex-shrink-0"
                        >
                          {currentlyPlaying === result.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>

                        <div className="flex-1 bg-muted rounded-full h-2 relative overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ 
                              width: currentlyPlaying === result.id ? '45%' : '0%' 
                            }}
                          />
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {results.length === 0 && !isGenerating && (
                  <div className="text-center py-12">
                    <AudioWaveform className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No audio generated yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter some text and click generate to get started
                    </p>
                  </div>
                )}

                {isGenerating && (
                  <Card className="p-4 bg-background border-border border-dashed">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Generating audio...</p>
                        <p className="text-xs text-muted-foreground">This may take a few moments</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TextToAudioGenerator;