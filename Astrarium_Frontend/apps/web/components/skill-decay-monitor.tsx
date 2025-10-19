import React, { useState, useEffect } from 'react';
import { SkillDecayInfo, DecayUrgency } from '@/types/astrarium';
import { astrariumClient } from '@/lib/api/astrarium-client';

interface SkillDecayMonitorProps {
  className?: string;
  onPracticeClick?: (skillId: number) => void;
}

const urgencyStyles: Record<DecayUrgency, { bg: string; text: string; icon: string }> = {
  CRITICAL: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-200', icon: '🚨' },
  HIGH: { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-800 dark:text-orange-200', icon: '⚠️' },
  MEDIUM: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-200', icon: '⚡' },
  LOW: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-200', icon: '💫' },
  MAINTENANCE: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-200', icon: '✨' }
};

export const SkillDecayMonitor: React.FC<SkillDecayMonitorProps> = ({
  className = '',
  onPracticeClick
}) => {
  const [decayingSkills, setDecayingSkills] = useState<SkillDecayInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDecayingSkills = async () => {
    try {
      const skills = await astrariumClient.getDecayingSkills();
      setDecayingSkills(skills);
    } catch (error) {
      console.error('Error fetching decaying skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDecayingSkills();
    // Check for decay every 30 minutes
    const interval = setInterval(fetchDecayingSkills, 1800000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className={`p-4 bg-card rounded-lg ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (decayingSkills.length === 0) {
    return (
      <div className={`p-6 bg-card rounded-lg ${className}`}>
        <div className="text-center py-8">
          <p className="text-xl">✨</p>
          <p className="text-lg font-semibold mt-2">All Skills Maintained!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your knowledge constellation is shining bright.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-card rounded-lg space-y-6 ${className}`}>
      <h3 className="text-lg font-semibold">Knowledge Decay Monitor</h3>
      
      <div className="space-y-4">
        {decayingSkills.map(({ skill, urgency, days_idle, recommendation }) => {
          const styles = urgencyStyles[urgency as DecayUrgency];
          return (
            <div
              key={skill.id}
              className={`p-4 rounded-lg ${styles.bg} ${styles.text}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    {styles.icon} {skill.skill_name}
                  </h4>
                  <p className="text-sm mt-1 opacity-90">
                    {days_idle} days since last practice
                  </p>
                  <p className="text-sm mt-2">{recommendation}</p>
                </div>
                
                <button
                  onClick={() => onPracticeClick?.(skill.id)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Practice Now
                </button>
              </div>

              <div className="mt-3">
                <p className="text-xs text-muted-foreground">Health Score</p>
                <div className="w-full bg-background/50 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-current h-1.5 rounded-full transition-all"
                    style={{ width: `${skill.health_score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};