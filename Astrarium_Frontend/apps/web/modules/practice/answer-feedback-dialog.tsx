"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import type { AnswerResult } from "@/types/astrarium";

interface AnswerFeedbackDialogProps {
  open: boolean;
  result: AnswerResult | null;
  onClose: () => void;
  onContinue?: () => void;
}

export function AnswerFeedbackDialog({
  open,
  result,
  onClose,
  onContinue,
}: AnswerFeedbackDialogProps) {
  if (!result) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle
              className={
                result.is_correct ? "text-green-500" : "text-red-500"
              }
            >
              {result.is_correct ? "🌟 Correct!" : "❌ Incorrect"}
            </DialogTitle>
            <Badge
              className={
                result.is_correct
                  ? "bg-green-500/20 text-green-500"
                  : "bg-red-500/20 text-red-500"
              }
            >
              {result.is_correct ? "+" : ""}
              {result.xp_earned} XP
            </Badge>
          </div>
          <DialogDescription>{result.message}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Answer Info */}
          {!result.is_correct && (
            <div className="rounded-lg border border-purple-500/20 bg-purple-950/20 p-4">
              <p className="mb-2 text-sm font-semibold text-purple-300">
                Correct Answer:
              </p>
              <p className="text-sm">{result.correct_answer}</p>
            </div>
          )}

          {/* Explanation */}
          {result.explanation && (
            <div className="rounded-lg border border-blue-500/20 bg-blue-950/20 p-4">
              <p className="mb-2 text-sm font-semibold text-blue-300">
                Explanation:
              </p>
              <p className="text-sm">{result.explanation}</p>
            </div>
          )}

          {/* Impact on Pet */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-purple-500/20 bg-purple-950/20 p-3 text-center">
              <p className="mb-1 text-xs text-muted-foreground">Pet Health</p>
              <p
                className={`text-lg font-bold ${result.pet_luminosity_change > 0 ? "text-green-500" : result.pet_luminosity_change < 0 ? "text-red-500" : "text-gray-500"}`}
              >
                {result.pet_luminosity_change > 0 ? "+" : ""}
                {result.pet_luminosity_change}
              </p>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 text-center">
              <p className="mb-1 text-xs text-muted-foreground">
                Knowledge Hunger
              </p>
              <p
                className={`text-lg font-bold ${result.pet_knowledge_hunger_change > 0 ? "text-green-500" : result.pet_knowledge_hunger_change < 0 ? "text-red-500" : "text-gray-500"}`}
              >
                {result.pet_knowledge_hunger_change > 0 ? "+" : ""}
                {result.pet_knowledge_hunger_change}
              </p>
            </div>
          </div>

          {/* Skill Health Impact */}
          <div className="rounded-lg border border-green-500/20 bg-green-950/20 p-3">
            <p className="mb-1 text-xs text-muted-foreground">
              Skill Health Change
            </p>
            <p
              className={`text-lg font-bold ${result.skill_health_change > 0 ? "text-green-500" : result.skill_health_change < 0 ? "text-red-500" : "text-gray-500"}`}
            >
              {result.skill_health_change > 0 ? "+" : ""}
              {result.skill_health_change}
            </p>
          </div>

          {/* Spaced Repetition Info */}
          {result.next_review_date && (
            <div className="rounded-lg border border-indigo-500/20 bg-indigo-950/20 p-3">
              <p className="mb-1 text-xs text-muted-foreground">
                Next Review Scheduled
              </p>
              <p className="text-sm">
                {new Date(result.next_review_date).toLocaleDateString()} (in{" "}
                {result.new_interval_days} days)
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={onContinue || onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
          >
            {onContinue ? "Continue Practicing" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
