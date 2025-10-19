"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { astrariumClient } from "@/lib/api/astrarium-client";
import type { UserSkill } from "@/types/astrarium";
import { DecayUrgency } from "@/types/astrarium";

interface SkillsListProps {
  onPracticeSkill?: (skill: UserSkill) => void;
}

export function SkillsList({ onPracticeSkill }: SkillsListProps) {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await astrariumClient.getMySkills();
      setSkills(data);
    } catch (error) {
      console.error("Failed to load skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-500";
    if (health >= 60) return "text-yellow-500";
    if (health >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getUrgencyBadge = (health: number, lastPracticed?: string) => {
    if (health >= 80) return <Badge variant="outline">Healthy</Badge>;
    if (health >= 60)
      return (
        <Badge className="bg-yellow-500/20 text-yellow-500">Needs Practice</Badge>
      );
    if (health >= 40)
      return (
        <Badge className="bg-orange-500/20 text-orange-500">Decaying</Badge>
      );
    return <Badge className="bg-red-500/20 text-red-500">Critical</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No skills tracked yet. Add your first skill to start!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {skills.map((skill) => (
        <Card
          key={skill.id}
          className="border-purple-500/20 bg-gradient-to-br from-purple-950/10 to-blue-950/10"
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{skill.skill_name}</CardTitle>
                {skill.category && (
                  <p className="text-sm text-muted-foreground">
                    {skill.category}
                  </p>
                )}
              </div>
              {getUrgencyBadge(skill.health_score, skill.last_practiced)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Proficiency</p>
                <p className="text-lg font-semibold">
                  {skill.proficiency_level}/10
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Star Power</p>
                <p className="text-lg font-semibold">
                  {"⭐".repeat(Math.ceil(skill.star_power / 20))}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Health Score</span>
                <span className={getHealthColor(skill.health_score)}>
                  {skill.health_score}/100
                </span>
              </div>
              <Progress
                value={skill.health_score}
                className="h-2"
                style={{
                  background:
                    skill.health_score < 40
                      ? "rgba(239, 68, 68, 0.2)"
                      : skill.health_score < 60
                        ? "rgba(249, 115, 22, 0.2)"
                        : "rgba(34, 197, 94, 0.2)",
                }}
              />
            </div>

            {skill.last_practiced && (
              <p className="text-xs text-muted-foreground">
                Last practiced:{" "}
                {new Date(skill.last_practiced).toLocaleDateString()}
              </p>
            )}

            {skill.next_review_date && (
              <p className="text-xs text-muted-foreground">
                Next review:{" "}
                {new Date(skill.next_review_date).toLocaleDateString()}
              </p>
            )}

            <Button
              onClick={() => onPracticeSkill?.(skill)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
              size="sm"
            >
              Practice Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
