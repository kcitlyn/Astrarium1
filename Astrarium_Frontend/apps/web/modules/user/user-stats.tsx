"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Progress } from "@workspace/ui/components/progress";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { astrariumClient } from "@/lib/api/astrarium-client";
import type { User } from "@/types/astrarium";

export function UserStats() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await astrariumClient.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥🔥🔥";
    if (streak >= 14) return "🔥🔥";
    if (streak >= 7) return "🔥";
    return "✨";
  };

  const getLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  const getXpProgress = (xp: number) => {
    return xp % 100;
  };

  return (
    <Card className="border-purple-500/20 bg-gradient-to-br from-purple-950/10 to-blue-950/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          👤 {user.username}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* XP and Level */}
        <div className="rounded-lg border border-purple-500/20 bg-purple-950/20 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">Level {getLevel(user.total_xp)}</span>
            <Badge className="bg-purple-500/20 text-purple-300">
              {user.total_xp} XP
            </Badge>
          </div>
          <Progress
            value={getXpProgress(user.total_xp)}
            className="h-3 bg-purple-950/40"
          />
          <p className="mt-2 text-xs text-muted-foreground text-center">
            {100 - getXpProgress(user.total_xp)} XP to next level
          </p>
        </div>

        {/* Streak */}
        <div className="rounded-lg border border-orange-500/20 bg-orange-950/20 p-4 text-center">
          <div className="mb-2 text-4xl">{getStreakEmoji(user.streak_count)}</div>
          <p className="text-2xl font-bold">{user.streak_count} Day Streak</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Keep practicing daily to maintain your streak!
          </p>
          {user.last_practice_date && (
            <p className="mt-2 text-xs text-muted-foreground">
              Last practice:{" "}
              {new Date(user.last_practice_date).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Account Info */}
        <div className="grid grid-cols-2 gap-2 text-center text-sm">
          <div className="rounded-lg border border-blue-500/20 bg-blue-950/20 p-3">
            <p className="mb-1 text-xs text-muted-foreground">Status</p>
            <Badge
              className={
                user.is_active
                  ? "bg-green-500/20 text-green-500"
                  : "bg-gray-500/20 text-gray-500"
              }
            >
              {user.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-950/20 p-3">
            <p className="mb-1 text-xs text-muted-foreground">Member Since</p>
            <p className="text-xs font-semibold">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
