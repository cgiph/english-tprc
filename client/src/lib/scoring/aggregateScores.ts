import { ScoreResult } from "./types";

export interface AggregatedScores {
  communicative: {
    speaking: number;
    writing: number;
    reading: number;
    listening: number;
  };
  skills: {
    fluency: number;
    pronunciation: number;
  };
}

export function aggregateScores(results: ScoreResult[]): AggregatedScores {
  const sections = {
    Speaking: { score: 0, max: 0 },
    Writing: { score: 0, max: 0 },
    Reading: { score: 0, max: 0 },
    Listening: { score: 0, max: 0 }
  };

  let totalFluency = 0;
  let totalPronunciation = 0;
  let speakingSubCount = 0;

  for (const res of results) {
    if (sections[res.section]) {
      sections[res.section].score += res.score;
      sections[res.section].max += res.maxScore;
    }

    // For Speaking: Track fluency and pronunciation averages
    if (res.section === "Speaking" && res.skills) {
      if (res.skills.fluency !== undefined) totalFluency += res.skills.fluency;
      if (res.skills.pronunciation !== undefined) totalPronunciation += res.skills.pronunciation;
      speakingSubCount++;
    }
  }

  // Normalize communicative scores to a 10–90 scale
  const scale = (curr: number, max: number) => {
    if (max === 0) return 10; // Minimum score
    const ratio = curr / max;
    return Math.round(10 + (ratio * 80)); 
  };

  return {
    communicative: {
      speaking: scale(sections.Speaking.score, sections.Speaking.max),
      writing: scale(sections.Writing.score, sections.Writing.max),
      reading: scale(sections.Reading.score, sections.Reading.max),
      listening: scale(sections.Listening.score, sections.Listening.max)
    },
    skills: {
      fluency: speakingSubCount > 0 ? Math.round(totalFluency / speakingSubCount) : 0,
      pronunciation: speakingSubCount > 0 ? Math.round(totalPronunciation / speakingSubCount) : 0
    }
  };
}
