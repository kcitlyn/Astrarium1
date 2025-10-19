// Astrarium Backend API Client

import type {
  UserCreate,
  UserLogin,
  AuthToken,
  User,
  SkillCreate,
  SkillUpdate,
  UserSkill,
  SkillDecayInfo,
  QuestionGenerate,
  Question,
  AnswerSubmission,
  AnswerResult,
  AnswerHistory,
  AlienPet,
  PetState,
  PetInteractionResult,
  SkillRecommendation,
} from "@/types/astrarium";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class AstrariumClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("astrarium_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          detail: "An error occurred",
        }));
        throw new Error(JSON.stringify(error.detail) || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // Check if it's a network error (backend not running)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          `Cannot connect to Astrarium backend at ${this.baseUrl}. Please ensure the backend server is running.`
        );
      }
      // Re-throw other errors
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("astrarium_token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("astrarium_token");
    }
  }

  // ============ AUTH ENDPOINTS ============

  async register(userData: UserCreate): Promise<AuthToken> {
    const result = await this.request<AuthToken>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    this.setToken(result.access_token);
    return result;
  }

  async login(credentials: UserLogin): Promise<AuthToken> {
    const result = await this.request<AuthToken>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    this.setToken(result.access_token);
    return result;
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  logout() {
    this.clearToken();
  }

  // ============ SKILLS ENDPOINTS ============

  async addSkill(skillData: SkillCreate): Promise<UserSkill> {
    return this.request<UserSkill>("/skills/add", {
      method: "POST",
      body: JSON.stringify(skillData),
    });
  }

  async getMySkills(): Promise<UserSkill[]> {
    return this.request<UserSkill[]>("/skills/my-skills");
  }

  async getSkill(skillId: number): Promise<UserSkill> {
    return this.request<UserSkill>(`/skills/skill/${skillId}`);
  }

  async updateSkill(
    skillId: number,
    updates: SkillUpdate
  ): Promise<UserSkill> {
    return this.request<UserSkill>(`/skills/skill/${skillId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deleteSkill(skillId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/skills/skill/${skillId}`, {
      method: "DELETE",
    });
  }

  async getDecayingSkills(): Promise<SkillDecayInfo[]> {
    return this.request<SkillDecayInfo[]>("/skills/decaying");
  }

  async getSkillsDueToday(): Promise<UserSkill[]> {
    return this.request<UserSkill[]>("/skills/due-today");
  }

  async getSkillRecommendations(): Promise<SkillRecommendation[]> {
    return this.request<SkillRecommendation[]>("/skills/recommendations");
  }

  // ============ QUESTIONS ENDPOINTS ============

  async generateQuestion(request: QuestionGenerate): Promise<Question> {
    return this.request<Question>("/questions/generate", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async submitAnswer(submission: AnswerSubmission): Promise<AnswerResult> {
    return this.request<AnswerResult>("/questions/answer", {
      method: "POST",
      body: JSON.stringify(submission),
    });
  }

  async getQuestionHistory(skillId: number): Promise<AnswerHistory[]> {
    return this.request<AnswerHistory[]>(`/questions/history/${skillId}`);
  }

  // ============ PETS ENDPOINTS ============

  async getMyPet(): Promise<AlienPet> {
    return this.request<AlienPet>("/pets/my-pet");
  }

  async getPetState(): Promise<PetState> {
    return this.request<PetState>("/pets/my-pet/state");
  }

  async interactWithPet(): Promise<PetInteractionResult> {
    return this.request<PetInteractionResult>("/pets/interact", {
      method: "POST",
    });
  }

  async updatePetDecay(): Promise<AlienPet> {
    return this.request<AlienPet>("/pets/update-decay", {
      method: "POST",
    });
  }
}

// Singleton instance
export const astrariumClient = new AstrariumClient();

// Export class for testing/custom instances
export { AstrariumClient };
