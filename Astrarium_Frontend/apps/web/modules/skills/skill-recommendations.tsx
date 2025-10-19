"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { astrariumClient } from "@/lib/api/astrarium-client";
import type { SkillRecommendation, UserSkill } from "@/types/astrarium";
import { DecayUrgency } from "@/types/astrarium";

interface SkillRecommendationsProps {
  onPracticeSkill?: (skill: UserSkill) => void;
}

export function SkillRecommendations({
  onPracticeSkill,
}: SkillRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<
    SkillRecommendation[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await astrariumClient.getSkillRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: DecayUrgency) => {
    switch (urgency) {
      case DecayUrgency.CRITICAL:
        return "bg-red-500/20 text-red-500";
      case DecayUrgency.HIGH:
        return "bg-orange-500/20 text-orange-500";
      case DecayUrgency.MEDIUM:
        return "bg-yellow-500/20 text-yellow-500";
      case DecayUrgency.LOW:
        return "bg-blue-500/20 text-blue-500";
      case DecayUrgency.MAINTENANCE:
        return "bg-green-500/20 text-green-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getUrgencyIcon = (urgency: DecayUrgency) => {
    switch (urgency) {
      case DecayUrgency.CRITICAL:
        return "🚨";
      case DecayUrgency.HIGH:
        return "⚠️";
      case DecayUrgency.MEDIUM:
        return "📊";
      case DecayUrgency.LOW:
        return "📈";
      case DecayUrgency.MAINTENANCE:
        return "✅";
      default:
        return "📋";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="border-green-500/20 bg-gradient-to-br from-green-950/10 to-emerald-950/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ✨ All Skills Healthy!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Great job! All your skills are in good shape. Keep up the practice!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-500/20 bg-gradient-to-br from-purple-950/10 to-indigo-950/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎯 AI Recommendations
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Skills that need attention based on decay analysis
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={rec.skill.id}
            className="rounded-lg border border-purple-500/20 bg-purple-950/20 p-4"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {getUrgencyIcon(rec.urgency)}
                </span>
                <div>
                  <h4 className="font-semibold">{rec.skill.skill_name}</h4>
                  {rec.skill.category && (
                    <p className="text-xs text-muted-foreground">
                      {rec.skill.category}
                    </p>
                  )}
                </div>
              </div>
              <Badge className={getUrgencyColor(rec.urgency)}>
                {rec.urgency}
              </Badge>
            </div>

            <p className="mb-3 text-sm text-muted-foreground">{rec.reason}</p>

            <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded bg-purple-950/40 p-2 text-center">
                <p className="text-xs text-muted-foreground">Questions</p>
                <p className="font-semibold">{rec.suggested_questions}</p>
              </div>
              <div className="rounded bg-purple-950/40 p-2 text-center">
                <p className="text-xs text-muted-foreground">
                  Est. Time
                </p>
                <p className="font-semibold">
                  {rec.estimated_time_minutes} min
                </p>
              </div>
            </div>

            <Button
              onClick={() => onPracticeSkill?.(rec.skill)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
              size="sm"
            >
              Practice Now
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
