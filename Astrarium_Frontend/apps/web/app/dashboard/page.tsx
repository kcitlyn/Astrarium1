"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@workspace/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { PetDashboard } from "@/modules/pet/pet-dashboard";
import { UserStats } from "@/modules/user/user-stats";
import { SkillsList } from "@/modules/skills/skills-list";
import { AddSkillDialog } from "@/modules/skills/add-skill-dialog";
import { SkillRecommendations } from "@/modules/skills/skill-recommendations";
import { PracticeSession } from "@/modules/practice/practice-session";
import { AnswerFeedbackDialog } from "@/modules/practice/answer-feedback-dialog";
import type { UserSkill, AnswerResult } from "@/types/astrarium";
import { astrariumClient } from "@/lib/api/astrarium-client";

export default function DashboardPage() {
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
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    // Try to login to Astrarium backend
    if (session.user.email) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email,
              password: "sync", // Backend needs to handle session-based auth
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          astrariumClient.setToken(data.access_token);
        }
      } catch (error) {
        console.error("Failed to sync with Astrarium:", error);
      }
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    astrariumClient.clearToken();
    router.push("/login");
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="text-center">
          <div className="mb-4 text-6xl">🌟</div>
          <p className="text-xl text-purple-300">Loading your cosmic companion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Astrarium
            </h1>
            <p className="text-muted-foreground">
              Your cosmic companion for skill mastery
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
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
                  Recommendations
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
