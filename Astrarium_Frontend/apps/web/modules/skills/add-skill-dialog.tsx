"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { astrariumClient } from "@/lib/api/astrarium-client";
import type { SkillCreate } from "@/types/astrarium";

interface AddSkillDialogProps {
  onSkillAdded?: () => void;
}

export function AddSkillDialog({ onSkillAdded }: AddSkillDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SkillCreate>({
    skill_name: "",
    category: "",
    proficiency_level: 5,
    star_power: 50,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await astrariumClient.addSkill({
        ...formData,
        category: formData.category || undefined,
      });
      setOpen(false);
      setFormData({
        skill_name: "",
        category: "",
        proficiency_level: 5,
        star_power: 50,
      });
      onSkillAdded?.();
    } catch (error) {
      console.error("Failed to add skill:", error);
      alert("Failed to add skill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          + Add Skill
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogDescription>
              Track a skill you want to master and prevent knowledge decay.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Skill Name</label>
              <Input
                placeholder="e.g., Docker, D3.js, Regex"
                value={formData.skill_name}
                onChange={(e) =>
                  setFormData({ ...formData, skill_name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category (Optional)</label>
              <Input
                placeholder="e.g., DevOps, Frontend, Backend"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Proficiency Level (1-10): {formData.proficiency_level}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.proficiency_level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    proficiency_level: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Importance (Star Power): {formData.star_power}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.star_power}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    star_power: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Skill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
