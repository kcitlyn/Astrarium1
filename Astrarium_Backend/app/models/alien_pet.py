from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class AlienSpecies(str, enum.Enum):
    NEBULA_SPRITE = "nebula_sprite"      # Gaseous, glowing
    STAR_CRAWLER = "star_crawler"        # Rocky, crystalline
    VOID_WISP = "void_wisp"              # Dark matter, ethereal
    COSMIC_BLOB = "cosmic_blob"          # Liquid, morphing
    QUANTUM_BEETLE = "quantum_beetle"    # Mechanical, geometric

class AlienMood(str, enum.Enum):
    RADIANT = "radiant"           # Very happy, glowing brightly
    CONTENT = "content"           # Stable, peaceful glow
    DIMMING = "dimming"           # Needs attention, fading
    FLICKERING = "flickering"     # Unstable, skill decay happening
    ECLIPSE = "eclipse"           # Very sad, almost dark

class EvolutionStage(str, enum.Enum):
    EGG = "egg"                   # Level 1
    HATCHING = "hatching"         # Level 2
    BABY = "baby"                 # Level 3-4
    LARVAE = "larvae"             # Level 5-6
    YOUNG = "young"               # Level 7-8
    JUVENILE = "juvenile"         # Level 9-10
    TEEN = "teen"                 # Level 11-14
    MATURING = "maturing"         # Level 15-19
    ADULT = "adult"               # Level 20-29
    PRIME = "prime"               # Level 30-39
    ELDER = "elder"               # Level 40-49
    CELESTIAL = "celestial"       # Level 50+

class AlienPet(Base):
    __tablename__ = "alien_pets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    name = Column(String, nullable=False)
    species = Column(Enum(AlienSpecies), default=AlienSpecies.NEBULA_SPRITE)
    mood = Column(Enum(AlienMood), default=AlienMood.CONTENT)
    evolution_stage = Column(Enum(EvolutionStage), default=EvolutionStage.EGG)
    
    # Core stats (0-100)
    luminosity = Column(Float, default=100.0)      # Brightness/health
    energy = Column(Float, default=100.0)          # Stamina for practice
    knowledge_hunger = Column(Float, default=50.0) # Desire to learn (lower = more hungry)
    cosmic_resonance = Column(Float, default=50.0) # Connection to skills
    
    # Progression
    level = Column(Integer, default=1)
    experience = Column(Integer, default=0)
    total_skills_mastered = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    last_fed = Column(DateTime, default=datetime.utcnow)  # Last correct answer
    last_updated = Column(DateTime, default=datetime.utcnow)
    
    # Visual customization (unlocked through progression)
    color_hue = Column(Integer, default=240)  # 0-360 for HSL color
    particle_effect = Column(String, default="stars")  # stars, nebula, void, etc.
    
    # Relationships
    user = relationship("User", back_populates="alien_pet")

    def update_mood(self):
        """Update alien mood based on stats"""
        # Handle None values for new instances
        luminosity = self.luminosity or 100.0
        energy = self.energy or 100.0
        knowledge_hunger = self.knowledge_hunger or 50.0

        # Higher knowledge_hunger is better (fed/satisfied)
        avg_health = (luminosity + energy + knowledge_hunger) / 3

        if avg_health >= 80:
            self.mood = AlienMood.RADIANT
        elif avg_health >= 60:
            self.mood = AlienMood.CONTENT
        elif avg_health >= 40:
            self.mood = AlienMood.DIMMING
        elif avg_health >= 20:
            self.mood = AlienMood.FLICKERING
        else:
            self.mood = AlienMood.ECLIPSE

        self.last_updated = datetime.utcnow()
    
    def feed_knowledge(self, skill_complexity: float = 1.0):
        """Feed the alien with correct answers (knowledge)"""
        knowledge_gain = 15 * skill_complexity

        # Restore stats (handle None values for new instances)
        # Knowledge hunger INCREASES when fed (represents satisfaction)
        self.knowledge_hunger = min(100, (self.knowledge_hunger or 50.0) + knowledge_gain)
        self.luminosity = min(100, (self.luminosity or 100.0) + knowledge_gain * 0.8)
        self.energy = min(100, (self.energy or 100.0) + knowledge_gain * 0.5)
        self.cosmic_resonance = min(100, (self.cosmic_resonance or 50.0) + knowledge_gain * 0.3)

        self.last_fed = datetime.utcnow()
        self.update_mood()
    
    def decay_stats(self, hours_since_last_feed: float):
        """Slowly decay stats when not practicing"""
        decay_rate = 0.5 * (hours_since_last_feed / 24)  # 0.5% per day

        # Handle None values for new instances
        self.knowledge_hunger = min(100, (self.knowledge_hunger or 50.0) + decay_rate * 2)
        self.luminosity = max(0, (self.luminosity or 100.0) - decay_rate)
        self.energy = max(0, (self.energy or 100.0) - decay_rate * 0.8)
        self.cosmic_resonance = max(0, (self.cosmic_resonance or 50.0) - decay_rate * 0.5)

        self.update_mood()
    
    def gain_experience(self, xp: int):
        """Add XP and handle leveling/evolution"""
        # Handle None values for new instances
        self.experience = (self.experience or 0) + xp
        self.level = self.level or 1

        # Keep leveling up while we have enough XP
        while True:
            xp_needed = self.level * 100

            if self.experience >= xp_needed:
                self.level += 1
                self.experience -= xp_needed

                # Boost stats on level up
                self.luminosity = min(100, (self.luminosity or 100.0) + 10)
                self.energy = min(100, (self.energy or 100.0) + 10)
            else:
                break

        # Check for evolution after all level ups
        self.check_evolution()
    
    def check_evolution(self):
        """Update evolution stage based on level"""
        level = self.level or 1
        if level >= 50:
            self.evolution_stage = EvolutionStage.CELESTIAL
        elif level >= 40:
            self.evolution_stage = EvolutionStage.ELDER
        elif level >= 30:
            self.evolution_stage = EvolutionStage.PRIME
        elif level >= 20:
            self.evolution_stage = EvolutionStage.ADULT
        elif level >= 15:
            self.evolution_stage = EvolutionStage.MATURING
        elif level >= 11:
            self.evolution_stage = EvolutionStage.TEEN
        elif level >= 9:
            self.evolution_stage = EvolutionStage.JUVENILE
        elif level >= 7:
            self.evolution_stage = EvolutionStage.YOUNG
        elif level >= 5:
            self.evolution_stage = EvolutionStage.LARVAE
        elif level >= 3:
            self.evolution_stage = EvolutionStage.BABY
        elif level >= 2:
            self.evolution_stage = EvolutionStage.HATCHING
        else:
            self.evolution_stage = EvolutionStage.EGG
    
    def get_state_description(self) -> dict:
        """Get a narrative description of the alien's current state"""
        descriptions = {
            AlienMood.RADIANT: f"{self.name} glows brilliantly, pulsing with cosmic energy! Stars orbit around it in perfect harmony.",
            AlienMood.CONTENT: f"{self.name} floats peacefully, emitting a steady, warm light. It seems satisfied.",
            AlienMood.DIMMING: f"{self.name}'s glow is fading slightly. It looks at you expectantly, hungry for knowledge.",
            AlienMood.FLICKERING: f"{self.name} flickers uncertainly, its light unstable. It desperately needs practice!",
            AlienMood.ECLIPSE: f"{self.name} is barely visible, its form shadowy and weak. Feed it knowledge immediately!"
        }
        
        return {
            "description": descriptions.get(self.mood, "Your alien observes you curiously."),
            "mood": self.mood.value,
            "evolution_stage": self.evolution_stage.value,
            "level": self.level,
            "next_evolution_at": self._next_evolution_level()
        }
    
    def _next_evolution_level(self) -> int:
        """Get the level needed for next evolution"""
        current_stage = self.evolution_stage
        if current_stage == EvolutionStage.EGG:
            return 6
        elif current_stage == EvolutionStage.LARVAE:
            return 16
        elif current_stage == EvolutionStage.JUVENILE:
            return 31
        elif current_stage == EvolutionStage.ADULT:
            return 51
        else:
            return self.level  # Already max