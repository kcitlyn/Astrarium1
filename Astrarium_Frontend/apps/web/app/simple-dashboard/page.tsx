"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Button } from "@workspace/ui/components/button";
import { PetDashboard } from "@/modules/pet/pet-dashboard";
import { UserStats } from "@/modules/user/user-stats";
import { SkillsList } from "@/modules/skills/skills-list";
import { AddSkillDialog } from "@/modules/skills/add-skill-dialog";
import { SkillRecommendations } from "@/modules/skills/skill-recommendations";
import { PracticeSession } from "@/modules/practice/practice-session";
import { AnswerFeedbackDialog } from "@/modules/practice/answer-feedback-dialog";
import { StarField } from "@/components/StarField";
import { ShootingStars } from "@/components/ShootingStars";
import type { UserSkill, AnswerResult } from "@/types/astrarium";
import { astrariumClient } from "@/lib/api/astrarium-client";

export default function SimpleDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeSkill, setActiveSkill] = useState<UserSkill | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Check if we have a token
    const token = typeof window !== "undefined" ? localStorage.getItem("astrarium_token") : null;

    if (!token) {
      router.push("/simple-login");
      return;
    }

    setLoading(false);
  };

  const handleSignOut = () => {
    astrariumClient.clearToken();
    router.push("/simple-login");
  };

  const handlePracticeSkill = (skill: UserSkill) => {
    setActiveSkill(skill);
  };

  const handleAnswerComplete = (result: AnswerResult) => {
    setAnswerResult(result);
    setShowFeedback(true);
    setActiveSkill(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleCancelPractice = () => {
    setActiveSkill(null);
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    setAnswerResult(null);
  };

  const handleSkillAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        <StarField />
        <ShootingStars />
        <div className="relative z-10 text-center">
          <div className="mb-4 text-6xl animate-pulse">🌟</div>
          <p className="text-xl text-purple-300">Loading your cosmic companion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      {/* Galaxy Background Effects */}
      <StarField />
      <ShootingStars />

      {/* Nebula Effect Overlays */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-20 left-10 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              Astrarium
            </h1>
            <p className="text-purple-200/80">
              Your cosmic companion for skill mastery
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="border-purple-500/30 bg-purple-950/30 backdrop-blur-sm hover:bg-purple-900/40">
            Sign Out
          </Button>
        </div>

        {/* Practice Session Overlay */}
        {activeSkill && (
          <div className="mb-8">
            <PracticeSession
              key={`practice-${activeSkill.id}-${Date.now()}`}
              skill={activeSkill}
              onComplete={handleAnswerComplete}
              onCancel={handleCancelPractice}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Pet & User Stats */}
          <div className="space-y-6">
            <PetDashboard key={`pet-${refreshKey}`} />
            <UserStats key={`user-${refreshKey}`} />
          </div>

          {/* Right Column - Skills & Practice */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="skills">My Skills</TabsTrigger>
                <TabsTrigger value="recommendations">

                </TabsTrigger>
              </TabsList>

              <TabsContent value="skills" className="mt-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Tracked Skills</h2>
                  <AddSkillDialog onSkillAdded={handleSkillAdded} />
                </div>
                <SkillsList
                  key={`skills-${refreshKey}`}
                  onPracticeSkill={handlePracticeSkill}
                />
              </TabsContent>

              <TabsContent value="recommendations" className="mt-6">
                <SkillRecommendations
                  key={`recs-${refreshKey}`}
                  onPracticeSkill={handlePracticeSkill}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Answer Feedback Dialog */}
      <AnswerFeedbackDialog
        open={showFeedback}
        result={answerResult}
        onClose={handleCloseFeedback}
      />
    </div>
  );
}
