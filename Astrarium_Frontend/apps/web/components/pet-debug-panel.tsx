"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Slider } from "@workspace/ui/components/slider";
import { astrariumClient } from "@/lib/api/astrarium-client";

interface PetDebugPanelProps {
  onUpdate?: () => void;
}

export function PetDebugPanel({ onUpdate }: PetDebugPanelProps) {
  const [decayRate, setDecayRate] = useState(1.0);
  const [evolving, setEvolving] = useState(false);

  const handleForceEvolve = async () => {
    try {
      setEvolving(true);
      const response = await fetch("http://localhost:8000/pets/debug/force-evolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to evolve pet");

      const data = await response.json();
      alert(`${data.message}\n${data.old_stage} → ${data.new_stage}\nLevel ${data.old_level} → ${data.new_level}`);
      onUpdate?.();
    } catch (error) {
      console.error("Failed to force evolve:", error);
      alert("Failed to evolve pet. Check console for details.");
    } finally {
      setEvolving(false);
    }
  };

  const handleDecayRateChange = async (value: number[]) => {
    const rate = value[0];
    setDecayRate(rate);

    try {
      await fetch("http://localhost:8000/pets/debug/set-decay-rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ multiplier: rate }),
      });
    } catch (error) {
      console.error("Failed to set decay rate:", error);
    }
  };

  return (
    <Card className="border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-orange-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-400">
          🛠️ Debug Panel
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          For demo and testing purposes
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Decay Rate Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Decay Rate: {decayRate.toFixed(1)}x
          </label>
          <div className="text-xs text-muted-foreground mb-2">
            {decayRate < 0.5 && "🐌 Very Slow Decay"}
            {decayRate >= 0.5 && decayRate < 1.0 && "🚶 Slow Decay"}
            {decayRate === 1.0 && "⚖️ Normal Decay"}
            {decayRate > 1.0 && decayRate <= 2.0 && "🏃 Fast Decay"}
            {decayRate > 2.0 && "⚡ Very Fast Decay"}
          </div>
          <Slider
            value={[decayRate]}
            onValueChange={handleDecayRateChange}
            min={0.1}
            max={5.0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.1x</span>
            <span>1.0x (Normal)</span>
            <span>5.0x</span>
          </div>
        </div>

        {/* Force Evolve Button */}
        <div className="space-y-2">
          <Button
            onClick={handleForceEvolve}
            disabled={evolving}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
          >
            {evolving ? "Gaining XP..." : "🚀 Add Experience (+150 XP)"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Add XP to help your pet level up and evolve gradually
          </p>
        </div>

        {/* Usage Notes */}
        <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 text-xs">
          <p className="font-semibold mb-1">💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Lower decay = stats decrease slower</li>
            <li>Higher decay = great for demos</li>
            <li>Click experience button multiple times to level up</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
