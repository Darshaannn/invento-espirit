// lib/utils/questionSelector.ts
// ─────────────────────────────────────────────────────────────────────────────
// Adaptive Question Selection Engine
// Selects a balanced, clinically relevant, randomized set of questions based on:
//   - Patient age group (child / adult / senior)
//   - Reported symptoms (memory, focus, confusion, etc.)
//   - Domain balance (Memory, Attention, Executive Function, Orientation)
//   - Difficulty distribution (easy / medium / hard)
//   - Sequence integrity (instruction → recall pairs must stay together)
// ─────────────────────────────────────────────────────────────────────────────

export type QuestionDomain = "Memory" | "Attention" | "Executive Function" | "Orientation";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: number;
  domain: string;
  question: string;
  options?: string[];
  correct?: string;
  type: "choice" | "text" | "instruction";
  difficulty: Difficulty;
  subType?: string;
  sequenceId?: string;
}

// ─── Segment Profiles ───────────────────────────────────────────────────────
// Each segment defines how many questions per domain and difficulty distribution

interface SegmentProfile {
  label: string;
  totalQuestions: number;
  domainWeights: Record<QuestionDomain, number>; // relative weight per domain
  difficultyMix: Record<Difficulty, number>;      // proportion out of 1.0
}

const SEGMENT_PROFILES: Record<string, SegmentProfile> = {
  // ── Age-based ──────────────────────────────────────────────────────────────
  child: {
    label: "Pediatric",
    totalQuestions: 20,
    domainWeights: { Memory: 3, Attention: 4, "Executive Function": 2, Orientation: 3 },
    difficultyMix: { easy: 0.7, medium: 0.25, hard: 0.05 },
  },
  adult: {
    label: "Adult",
    totalQuestions: 25,
    domainWeights: { Memory: 3, Attention: 3, "Executive Function": 3, Orientation: 3 },
    difficultyMix: { easy: 0.4, medium: 0.4, hard: 0.2 },
  },
  senior: {
    label: "Senior",
    totalQuestions: 22,
    domainWeights: { Memory: 5, Attention: 3, "Executive Function": 2, Orientation: 4 },
    difficultyMix: { easy: 0.5, medium: 0.35, hard: 0.15 },
  },

  // ── Symptom-modified ────────────────────────────────────────────────────────
  memory_focus: {
    label: "Memory Focused",
    totalQuestions: 25,
    domainWeights: { Memory: 8, Attention: 3, "Executive Function": 2, Orientation: 3 },
    difficultyMix: { easy: 0.3, medium: 0.5, hard: 0.2 },
  },
  attention_focus: {
    label: "Attention Focused",
    totalQuestions: 25,
    domainWeights: { Memory: 2, Attention: 8, "Executive Function": 3, Orientation: 2 },
    difficultyMix: { easy: 0.3, medium: 0.5, hard: 0.2 },
  },
  executive_focus: {
    label: "Executive Function Focused",
    totalQuestions: 25,
    domainWeights: { Memory: 2, Attention: 3, "Executive Function": 8, Orientation: 2 },
    difficultyMix: { easy: 0.3, medium: 0.45, hard: 0.25 },
  },
  orientation_focus: {
    label: "Orientation Focused",
    totalQuestions: 22,
    domainWeights: { Memory: 2, Attention: 2, "Executive Function": 2, Orientation: 8 },
    difficultyMix: { easy: 0.5, medium: 0.35, hard: 0.15 },
  },
  balanced: {
    label: "Balanced Standard",
    totalQuestions: 25,
    domainWeights: { Memory: 3, Attention: 3, "Executive Function": 3, Orientation: 3 },
    difficultyMix: { easy: 0.4, medium: 0.4, hard: 0.2 },
  },
};

// ─── Symptom → Segment Mapping ───────────────────────────────────────────────
const SYMPTOM_KEYWORDS: Record<string, string> = {
  memory: "memory_focus",
  forgetful: "memory_focus",
  forgetting: "memory_focus",
  recall: "memory_focus",
  focus: "attention_focus",
  distracted: "attention_focus",
  attention: "attention_focus",
  concentration: "attention_focus",
  confused: "executive_focus",
  confusion: "executive_focus",
  planning: "executive_focus",
  reasoning: "executive_focus",
  disoriented: "orientation_focus",
  orientation: "orientation_focus",
  time: "orientation_focus",
  place: "orientation_focus",
};

// ─── Age Group → Base Segment ────────────────────────────────────────────────
function getAgeSegment(age: string): string {
  const n = parseInt(age, 10);
  if (!isNaN(n)) {
    if (n <= 17) return "child";
    if (n >= 60) return "senior";
    return "adult";
  }
  // Handle age group strings
  const a = age.toLowerCase();
  if (a.includes("child") || a.includes("teen") || a.includes("youth")) return "child";
  if (a.includes("senior") || a.includes("elder") || a.includes("60") || a.includes("65") || a.includes("older")) return "senior";
  return "adult";
}

// ─── Symptom → Symptom Override ─────────────────────────────────────────────
function getSymptomSegment(symptoms: string[]): string | null {
  if (!symptoms || symptoms.length === 0) return null;

  const counts: Record<string, number> = {};
  for (const symptom of symptoms) {
    const s = symptom.toLowerCase();
    for (const [keyword, segment] of Object.entries(SYMPTOM_KEYWORDS)) {
      if (s.includes(keyword)) {
        counts[segment] = (counts[segment] || 0) + 1;
      }
    }
  }

  if (Object.keys(counts).length === 0) return null;

  // Return the most-reported symptom segment
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

// ─── Fisher-Yates Shuffle ────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Main Selection Function ─────────────────────────────────────────────────
export function selectQuestions(
  allQuestions: Question[],
  age: string,
  symptoms: string[] = []
): { questions: Question[]; profile: string; segment: string } {

  // 1. Determine segment
  const ageSegment = getAgeSegment(age);
  const symptomSegment = getSymptomSegment(symptoms);
  const activeSegmentKey = symptomSegment || ageSegment;
  const profile = SEGMENT_PROFILES[activeSegmentKey] || SEGMENT_PROFILES.balanced;

  // 2. Separate instruction questions and their paired recalls
  const sequencePairs: Record<string, { instruction: Question; recall: Question[] }> = {};
  const standaloneQuestions: Question[] = [];

  for (const q of allQuestions) {
    if (q.sequenceId) {
      if (!sequencePairs[q.sequenceId]) {
        sequencePairs[q.sequenceId] = { instruction: null as any, recall: [] };
      }
      if (q.type === "instruction" || q.subType === "instruction") {
        sequencePairs[q.sequenceId].instruction = q;
      } else {
        sequencePairs[q.sequenceId].recall.push(q);
      }
    } else if (q.type !== "instruction") {
      standaloneQuestions.push(q);
    }
  }

  // 3. Calculate target count per domain based on weights
  const domains: QuestionDomain[] = ["Memory", "Attention", "Executive Function", "Orientation"];
  const totalWeight = Object.values(profile.domainWeights).reduce((a, b) => a + b, 0);
  const domainTargets: Record<string, number> = {};

  // Reserve space for sequence pairs
  const numSequences = Math.min(2, Object.keys(sequencePairs).length); // include 1-2 pairs
  let remainingSlots = profile.totalQuestions - numSequences * 2; // instruction + recall = 2 slots

  for (const domain of domains) {
    domainTargets[domain] = Math.round(
      (profile.domainWeights[domain] / totalWeight) * remainingSlots
    );
  }

  // 4. For each domain, pick questions by difficulty distribution
  const selectedByDomain: Question[] = [];

  for (const domain of domains) {
    const target = domainTargets[domain];
    const pool = standaloneQuestions.filter((q) => q.domain === domain);

    // Split pool by difficulty
    const easy = shuffle(pool.filter((q) => q.difficulty === "easy"));
    const medium = shuffle(pool.filter((q) => q.difficulty === "medium"));
    const hard = shuffle(pool.filter((q) => q.difficulty === "hard"));

    const nEasy = Math.round(target * profile.difficultyMix.easy);
    const nMedium = Math.round(target * profile.difficultyMix.medium);
    const nHard = target - nEasy - nMedium;

    const picked = [
      ...easy.slice(0, nEasy),
      ...medium.slice(0, nMedium),
      ...hard.slice(0, Math.max(0, nHard)),
    ];

    // If not enough, fill with any remaining from pool
    const remaining = pool.filter((q) => !picked.includes(q));
    const fill = shuffle(remaining).slice(0, target - picked.length);
    selectedByDomain.push(...picked, ...fill);
  }

  // 5. Inject sequence pairs (instruction + recall) into the question list
  const shuffledPairs = shuffle(Object.values(sequencePairs).filter((p) => p.instruction));
  const selectedPairs = shuffledPairs.slice(0, numSequences);

  const sequenceBlocks: Question[] = [];
  for (const pair of selectedPairs) {
    sequenceBlocks.push(pair.instruction);
    sequenceBlocks.push(...pair.recall.slice(0, 1)); // one recall per instruction
  }

  // 6. Build final list: shuffle standalone, then place sequence blocks strategically
  // Sequences go at the start (for memory testing impact)
  const shuffledStandalone = shuffle(selectedByDomain);
  const finalQuestions = [
    ...sequenceBlocks,
    ...shuffledStandalone,
  ].slice(0, profile.totalQuestions);

  return {
    questions: finalQuestions,
    profile: profile.label,
    segment: activeSegmentKey,
  };
}
