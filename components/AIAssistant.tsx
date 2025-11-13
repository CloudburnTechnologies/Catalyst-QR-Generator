
import React, { useState } from 'react';
import { Sparkles, LoaderCircle } from 'lucide-react';
import type { GroundingChunk } from '../types';

interface AIAssistantProps {
  onGenerate: (prompt: string) => Promise<{ text: string, groundingChunks?: GroundingChunk[] | null }>;
  onComplete: (data: any) => void;
  parseResponse: (text: string) => any;
  placeholder: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onGenerate, onComplete, parseResponse, placeholder }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setError('');
    setSources([]);
    try {
      const { text, groundingChunks } = await onGenerate(prompt);
      if (groundingChunks) {
        setSources(groundingChunks);
      }
      const parsedData = parseResponse(text);
      onComplete(parsedData);
    } catch (e) {
      console.error(e);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border border-indigo-500/30 rounded-lg bg-indigo-500/10 mt-4 space-y-3">
      <div className="flex items-center gap-2 text-indigo-300">
        <Sparkles size={20} />
        <h3 className="font-semibold">Generate with AI</h3>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center w-32"
        >
          {isLoading ? <LoaderCircle className="animate-spin" size={20} /> : 'Generate'}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {sources.length > 0 && (
        <div className="text-xs text-gray-400">
          <p className="font-semibold mb-1">Sources:</p>
          <ul className="list-disc list-inside space-y-1">
            {sources.map((chunk, index) => {
               const source = chunk.web || chunk.maps;
               if (!source || !source.uri) return null;
               return (
                <li key={index}>
                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 underline">
                        {source.title || source.uri}
                    </a>
                </li>
               )
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
