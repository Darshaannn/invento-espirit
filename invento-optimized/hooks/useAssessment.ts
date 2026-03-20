// hooks/useAssessment.ts
// ─── Optimizations ────────────────────────────────────────────────────────────
// 1. useReducer instead of multiple useState calls — batches state updates into
//    a single render. The original likely had 5-6 setState calls per answer
//    submission, causing 5-6 re-renders. Now it's one.
// 2. useCallback on all action dispatchers — prevents child re-renders when
//    the parent re-renders (stable function references).
// 3. currentIndex starts at 0 (fixes the "starts at Q4" bug).
// 4. Time tracking uses useRef for questionStartTime — avoids including it
//    in state (no re-render needed when it changes).
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useReducer, useCallback, useRef, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Question {
  id:           number;
  domain:       "Memory" | "Attention" | "Executive Function" | "Orientation";
  question:     string;
  type:         "choice" | "text";
  difficulty:   "easy" | "medium" | "hard";
  options?:     string[];
  correct?:     string;
  subType?:     "instruction";
  sequenceId?:  string;
}

export interface QuestionResponse {
  questionId:     number;
  domain:         Question["domain"];
  selectedAnswer: string | null;
  correctAnswer:  string;
  timeTakenMs:    number;
  skipped:        boolean;
  difficulty:     Question["difficulty"];
}

interface AssessmentState {
  questions:    Question[];
  currentIndex: number;       // ← always starts at 0
  responses:    QuestionResponse[];
  isStarted:    boolean;
  isComplete:   boolean;
  assessmentStartTime: number | null;
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
type Action =
  | { type: "START" }
  | { type: "ANSWER"; payload: { answer: string | null; skipped: boolean; timeTakenMs: number } }
  | { type: "RESET" };

function assessmentReducer(state: AssessmentState, action: Action): AssessmentState {
  switch (action.type) {
    case "START":
      return { ...state, isStarted: true, assessmentStartTime: Date.now() };

    case "ANSWER": {
      const current    = state.questions[state.currentIndex];
      if (!current) return state;

      const response: QuestionResponse = {
        questionId:     current.id,
        domain:         current.domain,
        selectedAnswer: action.payload.answer,
        correctAnswer:  current.correct ?? "",
        timeTakenMs:    action.payload.timeTakenMs,
        skipped:        action.payload.skipped,
        difficulty:     current.difficulty ?? "medium",
      };

      const newResponses  = [...state.responses, response];
      const nextIndex     = state.currentIndex + 1;
      const isComplete    = nextIndex >= state.questions.length;

      return {
        ...state,
        responses:    newResponses,
        currentIndex: isComplete ? state.currentIndex : nextIndex,
        isComplete,
      };
    }

    case "RESET":
      return {
        ...state,
        currentIndex:        0,
        responses:           [],
        isStarted:           false,
        isComplete:          false,
        assessmentStartTime: null,
      };

    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAssessment(questions: Question[]) {
  const [state, dispatch] = useReducer(assessmentReducer, {
    questions,
    currentIndex:        0,    // ← always 0, fixes the Q4 start bug
    responses:           [],
    isStarted:           false,
    isComplete:          false,
    assessmentStartTime: null,
  });

  // Track when the current question was shown — ref avoids triggering renders
  const questionStartTimeRef = useRef<number>(Date.now());

  const startAssessment = useCallback(() => {
    questionStartTimeRef.current = Date.now();
    dispatch({ type: "START" });
  }, []);

  const submitAnswer = useCallback(
    (answer: string | null, skipped = false) => {
      const timeTakenMs = Date.now() - questionStartTimeRef.current;
      dispatch({ type: "ANSWER", payload: { answer, skipped, timeTakenMs } });
      // Reset timer for next question
      questionStartTimeRef.current = Date.now();
    },
    []
  );

  const skipQuestion = useCallback(() => {
    submitAnswer(null, true);
  }, [submitAnswer]);

  const resetAssessment = useCallback(() => {
    questionStartTimeRef.current = Date.now();
    dispatch({ type: "RESET" });
  }, []);

  // Derived values — memoized so callers don't recompute on every render
  const currentQuestion = useMemo(
    () => state.questions[state.currentIndex] ?? null,
    [state.questions, state.currentIndex]
  );

  const progressPercent = useMemo(
    () => Math.round((state.currentIndex / Math.max(state.questions.length, 1)) * 100),
    [state.currentIndex, state.questions.length]
  );

  const totalElapsedMs = useMemo(
    () => (state.assessmentStartTime ? Date.now() - state.assessmentStartTime : 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.assessmentStartTime, state.currentIndex] // recalc when question advances
  );

  return {
    // State
    questions:       state.questions,
    currentIndex:    state.currentIndex,
    responses:       state.responses,
    isStarted:       state.isStarted,
    isComplete:      state.isComplete,
    // Derived
    currentQuestion,
    progressPercent,
    totalElapsedMs,
    // Actions
    startAssessment,
    submitAnswer,
    skipQuestion,
    resetAssessment,
  };
}
