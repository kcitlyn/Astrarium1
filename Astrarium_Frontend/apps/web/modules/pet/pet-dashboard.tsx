"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { astrariumClient } from "@/lib/api/astrarium-client";
import type { AlienPet, PetState } from "@/types/astrarium";
import { PetMood, EvolutionStage } from "@/types/astrarium";
import { PetDebugPanel } from "@/components/pet-debug-panel";

export function PetDashboard() {
  const [pet, setPet] = useState<AlienPet | null>(null);
  const [petState, setPetState] = useState<PetState | null>(null);
  const [loading, setLoading] = useState(true);
  const [interacting, setInteracting] = useState(false);

  useEffect(() => {
    loadPetData();
  }, []);

  const loadPetData = async () => {
    try {
      setLoading(true);
      const [petData, stateData] = await Promise.all([
        astrariumClient.getMyPet(),
        astrariumClient.getPetState(),
      ]);
      setPet(petData);
      setPetState(stateData);
    } catch (error) {
      console.error("Failed to load pet:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInteract = async () => {
    try {
      setInteracting(true);
      await astrariumClient.interactWithPet();
      await loadPetData();
    } catch (error) {
      console.error("Failed to interact with pet:", error);
    } finally {
      setInteracting(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!pet || !petState) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center text-muted-foreground">
          No pet found. Please register to get your alien companion!
        </CardContent>
      </Card>
    );
  }

  const getMoodColor = (mood: PetMood) => {
    switch (mood) {
      case PetMood.RADIANT:
        return "bg-yellow-500";
      case PetMood.CONTENT:
        return "bg-green-500";
      case PetMood.DIMMING:
        return "bg-blue-500";
      case PetMood.FLICKERING:
        return "bg-orange-500";
      case PetMood.ECLIPSE:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStageDisplay = (stage: EvolutionStage) => {
    console.log("Current evolution stage:", stage, "Type:", typeof stage);

    // Normalize stage string for comparison
    const normalizedStage = (stage as string).toLowerCase();

    switch (normalizedStage) {
      case "egg":
        return (
          <div className="relative animate-pulse">
            <div className="text-9xl">🥚</div>
          </div>
        );
      case "hatching":
        return (
          <div className="relative">
            <div className="text-9xl">🥚</div>
            <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">
              ✨
            </div>
          </div>
        );
      case "baby":
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="text-7xl">👶</div>
            <div className="text-3xl">💫</div>
          </div>
        );
      case "larvae":
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="text-7xl">👽</div>
            <div className="text-3xl opacity-70">💫</div>
          </div>
        );
      case "young":
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="text-7xl">🐛</div>
            <div className="text-4xl">✨💫</div>
          </div>
        );
      case "juvenile":
        return (
          <div className="flex flex-col items-center gap-1">
            <div className="text-7xl">👾</div>
            <div className="text-3xl">✨💫✨</div>
          </div>
        );
      case "teen":
        return (
          <div className="flex flex-col items-center gap-1">
            <div className="text-8xl">🤖</div>
            <div className="text-3xl">⭐💫⭐</div>
          </div>
        );
      case "maturing":
        return (
          <div className="flex flex-col items-center">
            <div className="text-8xl">🦾</div>
            <div className="text-4xl">🌟✨🌟</div>
          </div>
        );
      case "adult":
        return (
          <div className="flex flex-col items-center">
            <div className="text-8xl">🛸</div>
            <div className="text-4xl">🌟💫🌟</div>
          </div>
        );
      case "prime":
        return (
          <div className="flex flex-col items-center relative">
            <div className="text-9xl">🚀</div>
            <div className="text-4xl">✨🌟✨🌟✨</div>
          </div>
        );
      case "elder":
        return (
          <div className="flex flex-col items-center relative">
            <div className="text-9xl">🌠</div>
            <div className="absolute inset-0 animate-pulse text-6xl flex items-center justify-center">
              ✨🌟✨
            </div>
          </div>
        );
      case "celestial":
        return (
          <div className="flex flex-col items-center relative">
            <div className="text-9xl">🌌</div>
            <div className="absolute inset-0 animate-spin-slow text-6xl flex items-center justify-center">
              ✨🌟✨
            </div>
          </div>
        );
      default:
        return <div className="text-8xl">👽</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Pet Display Card */}
      <Card className="w-full overflow-hidden border-2 border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-blue-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-bold">{pet.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs capitalize">
                  {pet.species.replace(/_/g, " ")}
                </Badge>
                <Badge className={getMoodColor(pet.mood)}>{pet.mood}</Badge>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-lg font-bold">
                {pet.evolution_stage === "egg" ? "Level 1" : `Level ${pet.level}`}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pet Visual */}
          <div
            className="relative flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-purple-500/30 bg-gradient-to-br from-pink-100/10 via-purple-100/10 to-blue-100/10"
            style={{
              filter: `hue-rotate(${pet.color_hue}deg) brightness(1.2)`,
              background: `radial-gradient(circle at 50% 50%, rgba(255, 182, 193, 0.15), rgba(221, 160, 221, 0.15), rgba(173, 216, 230, 0.15))`,
            }}
          >
            {getStageDisplay(pet.evolution_stage)}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                <div className="text-sm font-bold text-white">
                  Level {pet.level}
                </div>
              </div>
            </div>
          </div>

          {/* Pet Stats */}
          <div className="space-y-3">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Luminosity (Health)</span>
                <span className="font-semibold">{pet.luminosity}/100</span>
              </div>
              <Progress
                value={pet.luminosity}
                className="h-2 bg-purple-950/40"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Energy</span>
                <span className="font-semibold">{pet.energy}/100</span>
              </div>
              <Progress value={pet.energy} className="h-2 bg-blue-950/40" />
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Knowledge Hunger</span>
                <span className="font-semibold">
                  {pet.knowledge_hunger}/100
                </span>
              </div>
              <Progress
                value={pet.knowledge_hunger}
                className="h-2 bg-amber-950/40"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Cosmic Resonance</span>
                <span className="font-semibold">
                  {pet.cosmic_resonance}/100
                </span>
              </div>
              <Progress
                value={pet.cosmic_resonance}
                className="h-2 bg-violet-950/40"
              />
            </div>
          </div>

          {/* Experience Bar */}
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold">Experience</span>
              <span>{pet.experience} XP</span>
            </div>
            <Progress
              value={(pet.experience % 100) || 1}
              className="h-3 bg-gradient-to-r from-purple-950/40 to-pink-950/40"
            />
          </div>

          {/* Pet State Narrative */}
          {petState.narrative && (
            <div className="rounded-lg border border-purple-500/20 bg-purple-950/20 p-4">
              <p className="text-sm italic text-purple-200">
                {petState.narrative}
              </p>
            </div>
          )}

          {/* Interaction Button */}
          <Button
            onClick={handleInteract}
            disabled={interacting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {interacting ? "Interacting..." : "Pet Your Companion"}
          </Button>

          {/* Pet Info */}
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <p className="text-muted-foreground">Skills Mastered</p>
              <p className="text-xl font-bold">
                {pet.total_skills_mastered} {pet.total_skills_mastered === 1 ? 'skill' : 'skills'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Days Since Hatched</p>
              <p className="text-xl font-bold">
                {pet.hatched_at
                  ? Math.floor(
                      (Date.now() - new Date(pet.hatched_at).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : "Not hatched yet"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Panel */}
      <PetDebugPanel onUpdate={loadPetData} />
    </div>
  );
}
