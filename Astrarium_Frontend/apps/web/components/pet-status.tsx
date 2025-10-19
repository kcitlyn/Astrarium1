import React, { useState, useEffect } from 'react';
import { AlienPet, PetMood, PetState } from '@/types/astrarium';
import { astrariumClient } from '@/lib/api/astrarium-client';

interface PetStatusProps {
  className?: string;
}

const moodEmojis: Record<PetMood, string> = {
  radiant: '✨',
  content: '🌟',
  dimming: '🌙',
  flickering: '⚡',
  eclipse: '🌑'
};

const moodColors: Record<PetMood, string> = {
  radiant: 'text-yellow-400',
  content: 'text-blue-400',
  dimming: 'text-purple-400',
  flickering: 'text-orange-400',
  eclipse: 'text-gray-400'
};

export const PetStatus: React.FC<PetStatusProps> = ({ className = '' }) => {
  const [pet, setPet] = useState<AlienPet | null>(null);
  const [petState, setPetState] = useState<PetState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [interactionMessage, setInteractionMessage] = useState<string | null>(null);

  const fetchPetData = async () => {
    try {
      const [petData, stateData] = await Promise.all([
        astrariumClient.getMyPet(),
        astrariumClient.getPetState()
      ]);
      setPet(petData);
      setPetState(stateData);
    } catch (error) {
      console.error('Error fetching pet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInteraction = async () => {
    try {
      const result = await astrariumClient.interactWithPet();
      setInteractionMessage(result.message);
      // Refetch pet data to show updated state
      fetchPetData();
      
      // Clear interaction message after a delay
      setTimeout(() => setInteractionMessage(null), 3000);
    } catch (error) {
      console.error('Error interacting with pet:', error);
    }
  };

  useEffect(() => {
    fetchPetData();
    // Periodically update pet state
    const interval = setInterval(fetchPetData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className={`p-4 bg-card rounded-lg ${className}`}>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-8 bg-muted rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!pet || !petState) {
    return (
      <div className={`p-4 bg-card rounded-lg ${className}`}>
        <p className="text-muted-foreground">No pet found</p>
      </div>
    );
  }

  const mood = pet.mood as PetMood;
  const moodEmoji = moodEmojis[mood] || '❓';
  const moodColor = moodColors[mood] || 'text-gray-400';

  return (
    <div className={`p-6 bg-card rounded-lg space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            {pet.name}
            <span className={`text-2xl ${moodColor}`}>{moodEmoji}</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Level {pet.level} {pet.species.toLowerCase().replace('_', ' ')}
          </p>
        </div>
        <button
          onClick={handleInteraction}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Interact
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Energy</p>
          <div className="w-full bg-background rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${pet.energy}%` }}
            ></div>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Luminosity</p>
          <div className="w-full bg-background rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all"
              style={{ width: `${pet.luminosity}%` }}
            ></div>
          </div>
        </div>
      </div>

      {petState.narrative && (
        <p className="text-sm italic text-muted-foreground">{petState.narrative}</p>
      )}

      {interactionMessage && (
        <div className="p-3 bg-accent rounded-lg text-sm animate-fadeIn">
          {interactionMessage}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        <p>Evolution Stage: {petState.evolution_stage}</p>
        <p>Next evolution at level {petState.next_evolution_at}</p>
      </div>
    </div>
  );
};