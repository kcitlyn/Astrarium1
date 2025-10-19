"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import { astrariumClient } from "@/lib/api/astrarium-client";
import type { UserSkill, Question, AnswerResult } from "@/types/astrarium";
import { QuestionType } from "@/types/astrarium";

interface PracticeSessionProps {
  skill: UserSkill;
  onComplete?: (result: AnswerResult) => void;
  onCancel?: () => void;
}

export function PracticeSession({
  skill,
  onComplete,
  onCancel,
}: PracticeSessionProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const generateQuestion = async () => {
    try {
      setLoading(true);
      const q = await astrariumClient.generateQuestion({
        skill_id: skill.id,
      });
      setQuestion(q);
      setUserAnswer("");
    } catch (error) {
      console.error("Failed to generate question:", error);
      alert("Failed to generate question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!question || !userAnswer.trim()) return;

    try {
      setSubmitting(true);
      const result = await astrariumClient.submitAnswer({
        question_id: question.question_id,
        user_answer: userAnswer,
      });
      onComplete?.(result);
    } catch (error) {
      console.error("Failed to submit answer:", error);
      alert("Failed to submit answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!question) {
    return (
      <Card className="w-full border-2 border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-blue-950/20">
        <CardHeader>
          <CardTitle>Practice: {skill.skill_name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Ready to sharpen your skills and feed your cosmic companion?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-purple-500/20 bg-purple-950/20 p-4">
            <div className="mb-4 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Health</p>
                <p className="text-2xl font-bold">{skill.health_score}/100</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Proficiency</p>
                <p className="text-2xl font-bold">
                  {skill.proficiency_level}/10
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={generateQuestion}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {loading ? "Generating..." : "Start Practice"}
            </Button>
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-2 border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-blue-950/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Practice: {skill.skill_name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {question.difficulty.toUpperCase()} •{" "}
              {question.cosmic_reward} XP
            </p>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300">
            {question.question_type === QuestionType.MULTIPLE_CHOICE
              ? "Multiple Choice"
              : "Open Ended"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question */}
        <div className="rounded-lg border border-purple-500/20 bg-purple-950/30 p-6">
          <p className="text-lg leading-relaxed">{question.question_text}</p>
        </div>

        {/* Answer Input */}
        {question.question_type === QuestionType.MULTIPLE_CHOICE &&
        question.options ? (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setUserAnswer(option)}
                className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                  userAnswer === option
                    ? "border-purple-500 bg-purple-500/20"
                    : "border-purple-500/20 bg-purple-950/10 hover:border-purple-500/40 hover:bg-purple-950/20"
                }`}
              >
                <span className="font-semibold text-purple-300">
                  {String.fromCharCode(65 + index)}.
                </span>{" "}
                {option}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Answer</label>
            <Input
              placeholder="Type your answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="border-purple-500/20 bg-purple-950/20"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={submitAnswer}
            disabled={!userAnswer.trim() || submitting}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
          >
            {submitting ? "Submitting..." : "Submit Answer"}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
