// hooks/useAssessment.ts
// Optimized: useReducer for atomic state, stable callbacks, localStorage save on complete.
"use client";

import { useReducer, useCallback, useEffect, useRef } from "react";

export type Domain = "Memory" | "Attention" | "Executive Function" | "Orientation";

export interface Question {
  id: number;
  domain: Domain;
  question: string;
  type: "choice" | "text";
  difficulty: "easy" | "medium" | "hard";
  options?: string[];
  correct?: string;
  subType?: "instruction";
  sequenceId?: string;
}

export interface QuestionResponse {
  questionId: number;
  domain: Domain;
  selectedAnswer: string | null;
  correctAnswer: string;
  timeTakenMs: number;
  skipped: boolean;
  difficulty: "easy" | "medium" | "hard";
}

interface AssessmentState {
  questions: Question[];
  currentIndex: number;
  responses: QuestionResponse[];
  selectedAnswer: string | null;
  startTime: number | null;
  questionStartTime: number | null;
  isStarted: boolean;
  isComplete: boolean;
}

type Action =
  | { type: "START" }
  | { type: "SELECT_ANSWER"; answer: string }
  | { type: "SUBMIT_ANSWER" }
  | { type: "SKIP" }
  | { type: "NEXT_INSTRUCTION" };

function reducer(state: AssessmentState, action: Action): AssessmentState {
  switch (action.type) {
    case "START":
      return { ...state, isStarted: true, startTime: Date.now(), questionStartTime: Date.now() };

    case "SELECT_ANSWER":
      return { ...state, selectedAnswer: action.answer };

    case "SUBMIT_ANSWER": {
      const current = state.questions[state.currentIndex];
      const timeTakenMs = Date.now() - (state.questionStartTime ?? Date.now());
      const response: QuestionResponse = {
        questionId: current.id, domain: current.domain,
        selectedAnswer: state.selectedAnswer, correctAnswer: current.correct ?? "",
        timeTakenMs, skipped: false, difficulty: current.difficulty,
      };
      const newResponses = [...state.responses, response];
      const nextIndex = state.currentIndex + 1;
      const isComplete = nextIndex >= state.questions.length;
      return { ...state, responses: newResponses, currentIndex: isComplete ? state.currentIndex : nextIndex, selectedAnswer: null, questionStartTime: Date.now(), isComplete };
    }

    case "SKIP": {
      const current = state.questions[state.currentIndex];
      const timeTakenMs = Date.now() - (state.questionStartTime ?? Date.now());
      const response: QuestionResponse = {
        questionId: current.id, domain: current.domain,
        selectedAnswer: null, correctAnswer: current.correct ?? "",
        timeTakenMs, skipped: true, difficulty: current.difficulty,
      };
      const newResponses = [...state.responses, response];
      const nextIndex = state.currentIndex + 1;
      const isComplete = nextIndex >= state.questions.length;
      return { ...state, responses: newResponses, currentIndex: isComplete ? state.currentIndex : nextIndex, selectedAnswer: null, questionStartTime: Date.now(), isComplete };
    }

    case "NEXT_INSTRUCTION": {
      const nextIndex = state.currentIndex + 1;
      return { ...state, currentIndex: nextIndex >= state.questions.length ? state.currentIndex : nextIndex, questionStartTime: Date.now(), isComplete: nextIndex >= state.questions.length };
    }

    default: return state;
  }
}

export function useAssessment(questions: Question[]) {
  const [state, dispatch] = useReducer(reducer, {
    questions, currentIndex: 0, responses: [], selectedAnswer: null,
    startTime: null, questionStartTime: null, isStarted: false, isComplete: false,
  });

  useEffect(() => {
    if (!state.isComplete || state.responses.length === 0) return;
    try {
      const history = JSON.parse(localStorage.getItem("invento_history") ?? "[]") as any[];
      history.unshift({ date: new Date().toISOString(), responses: state.responses, totalTimeMs: state.responses.reduce((a, r) => a + r.timeTakenMs, 0) });
      localStorage.setItem("invento_history", JSON.stringify(history.slice(0, 20)));
    } catch { }
  }, [state.isComplete]); // eslint-disable-line

  const start = useCallback(() => dispatch({ type: "START" }), []);
  const selectAnswer = useCallback((a: string) => dispatch({ type: "SELECT_ANSWER", answer: a }), []);
  const submitAnswer = useCallback(() => dispatch({ type: "SUBMIT_ANSWER" }), []);
  const skip = useCallback(() => dispatch({ type: "SKIP" }), []);
  const nextInstruction = useCallback(() => dispatch({ type: "NEXT_INSTRUCTION" }), []);

  const currentQuestion = state.questions[state.currentIndex] ?? null;
  const isInstruction = currentQuestion?.subType === "instruction";
  const progress = state.questions.length > 0 ? Math.round((state.currentIndex / state.questions.length) * 100) : 0;

  return {
    currentQuestion, currentIndex: state.currentIndex, totalQuestions: state.questions.length,
    responses: state.responses, selectedAnswer: state.selectedAnswer,
    isStarted: state.isStarted, isComplete: state.isComplete,
    isInstruction, progress, canSubmit: state.selectedAnswer !== null && !isInstruction,
    start, selectAnswer, submitAnswer, skip, nextInstruction,
  };
}
