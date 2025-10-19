// Backend API Types for Astrarium Pet Simulator

export enum PetSpecies {
  NEBULA_SPRITE = "NEBULA_SPRITE",
  STAR_CRAWLER = "STAR_CRAWLER",
  VOID_WISP = "VOID_WISP",
  COSMIC_BLOB = "COSMIC_BLOB",
  QUANTUM_BEETLE = "QUANTUM_BEETLE"
}

export enum PetMood {
  RADIANT = "radiant",
  CONTENT = "content",
  DIMMING = "dimming",
  FLICKERING = "flickering",
  ECLIPSE = "eclipse"
}

export enum EvolutionStage {
  EGG = "egg",           // L1
  HATCHING = "hatching", // L2
  BABY = "baby",         // L3-4
  LARVAE = "larvae",     // L5-6
  YOUNG = "young",       // L7-8
  JUVENILE = "juvenile", // L9-10
  TEEN = "teen",         // L11-14
  MATURING = "maturing", // L15-19
  ADULT = "adult",       // L20-29
  PRIME = "prime",       // L30-39
  ELDER = "elder",       // L40-49
  CELESTIAL = "celestial" // L50+
}

export enum DecayUrgency {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
  MAINTENANCE = "MAINTENANCE"
}

export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  OPEN_ENDED = "open_ended"
}

export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard"
}

// User Types
export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
  is_active: boolean;
  streak_count: number;
  last_practice_date?: string;
  total_xp: number;
}

export interface UserCreate {
  email: string;
  username: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: User;
}

// Skill Types
export interface UserSkill {
  id: number;
  user_id: number;
  skill_name: string;
  category?: string;
  proficiency_level: number; // 1-10
  health_score: number; // 0-100
  star_power: number; // 0-100
  last_used?: string;
  last_practiced?: string;
  decay_rate: number;
  next_review_date?: string;
  review_interval_days: number;
  ease_factor: number;
  consecutive_correct: number;
  consecutive_wrong: number;
  created_at: string;
}

export interface SkillCreate {
  skill_name: string;
  category?: string;
  proficiency_level?: number;
  last_used?: string;
  star_power?: number;
}

export interface SkillUpdate {
  proficiency_level?: number;
  health_score?: number;
  last_used?: string;
  star_power?: number;
}

export interface SkillDecayInfo {
  skill: UserSkill;
  days_idle: number;
  urgency: DecayUrgency;
  recommendation: string;
}

// Question Types
export interface Question {
  question_id: number;
  skill_id?: number;
  question_text: string;
  question_type: QuestionType;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
  difficulty: Difficulty;
  cosmic_reward: number; // XP value
  created_at?: string;
}

export interface QuestionGenerate {
  skill_id: number;
  difficulty?: Difficulty;
  question_type?: QuestionType;
}

export interface AnswerSubmission {
  question_id: number;
  user_answer: string;
}

export interface AnswerResult {
  is_correct: boolean;
  correct_answer: string;
  explanation?: string;
  xp_earned: number;
  skill_health_change: number;
  pet_mood: string;
  pet_message: string;
  next_review_date?: string;
  review_interval_days: number;
}

export interface AnswerHistory {
  id: number;
  user_id: number;
  question_id: number;
  user_answer: string;
  is_correct: boolean;
  answered_at: string;
  question?: Question;
}

// Pet Types
export interface AlienPet {
  id: number;
  user_id: number;
  species: PetSpecies;
  name: string;
  level: number;
  experience: number;
  evolution_stage: EvolutionStage;
  mood: PetMood;
  luminosity: number; // 0-100 (health)
  energy: number; // 0-100
  knowledge_hunger: number; // 0-100
  cosmic_resonance: number; // 0-100
  color_hue: number; // 0-360 (HSL)
  particle_effect: string;
  total_skills_mastered: number;
  hatched_at: string;
  last_fed?: string;
  last_interaction?: string;
}

export interface PetState {
  narrative: string;
  mood: string;
  evolution_stage: string;
  level: number;
  next_evolution_at: number;
}

export interface PetInteractionResult {
  message: string;
  energy_change: number;
  new_mood?: PetMood;
}

// Practice Session Types
export interface PracticeSession {
  id: number;
  user_id: number;
  skill_id: number;
  started_at: string;
  ended_at?: string;
  questions_answered: number;
  correct_answers: number;
  duration_minutes: number;
  xp_earned: number;
}

// Recommendation Types
export interface SkillRecommendation {
  skill: UserSkill;
  reason: string;
  urgency: DecayUrgency;
  suggested_questions: number;
  estimated_time_minutes: number;
}

// API Response Wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  detail: string;
}
