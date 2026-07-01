export const MOCK_QUOTES = [
  {
    text: "A mock test score is a diagnostic tool, not a final judgement. It shows you where the holes in your boat are so you can patch them up before the actual exam.",
    author: "Older Sibling"
  },
  {
    text: "Physics formulas and Organic chemistry mechanisms are tough, yes. But they aren't tougher than your resilience. Take it one chapter, one numerical at a time.",
    author: "Older Sibling"
  },
  {
    text: "Do not compare your Chapter 2 preparation with someone else's Chapter 20 revision. Your competition is only with who you were yesterday.",
    author: "Older Sibling"
  },
  {
    text: "Five years from now, nobody will ask you what score you got on mock test #6. What will matter is the grit you built while pushing through these days.",
    author: "Older Sibling"
  },
  {
    text: "Burnout is not a badge of honor. A rested brain solves complex IIT-JEE or NEET questions much faster than a sleep-deprived one. Go sleep!",
    author: "Older Sibling"
  }
];

export const MOCK_COPING_RESOURCES = {
  chemistry: {
    siblingAdvice: "Look, Organic Chemistry isn't about memorizing 500 reactions. It's about electron flow and stability. Treat it like a game of chess. Inorganic needs constant spaced repetition—make a reaction chart and paste it on your wall. Don't panic.",
    personalizedCoping: "Divide your organic chemistry chapters into mechanism families (Nucleophilic substitution, elimination). Revise name reactions for 15 minutes daily instead of doing a 3-hour marathon.",
    mindfulnessExercise: "5-minute Palm Press exercise to ground your focus.",
    tenMinuteAction: "Write down the mechanism of Aldol Condensation once on a blank sheet without looking, then check it."
  },
  physics: {
    siblingAdvice: "Physics isn't about memorizing formulas; it's about visualization. If you can't visualize the block sliding or the current flowing, the formula won't save you. Draw a free-body diagram for every problem, even the easy ones.",
    personalizedCoping: "Focus on understanding the core derivation of a formula. If you know how it is born, you will know where it applies and where it fails.",
    mindfulnessExercise: "4-7-8 Breathing to ease mathematical anxiety.",
    tenMinuteAction: "Take one hard kinematics or mechanics question, draw its detailed free-body diagram, and write down the equations without solving it."
  },
  math: {
    siblingAdvice: "Math is all about muscle memory. You cannot 'read' Math. You have to scratch paper. If you're stuck on calculus or coordinate geometry, go back to basics. Solve 5 simple problems to get your confidence back, then tackle the mock test level.",
    personalizedCoping: "Keep a 'Mistake Book'. Write down every math calculation error or concept mistake you make. Review this book before every mock test.",
    mindfulnessExercise: "2-minute Progressive Muscle Relaxation for hands and shoulders.",
    tenMinuteAction: "Solve exactly 3 basic integration or trigonometry questions to build a quick momentum."
  },
  biology: {
    siblingAdvice: "NCERT Biology is your Bible for NEET. Every single line is a potential question. Don't just read it; active recall is key. Cover the text and try to explain the diagram or process in your own words. Use mnemonics for classifications.",
    personalizedCoping: "Create flashcards for complex cycles (like Krebs or Calvin cycle) and morphological terms. Space out your reviews over 1, 3, and 7 days.",
    mindfulnessExercise: "3-minute Sensory Grounding (5-4-3-2-1 technique).",
    tenMinuteAction: "Pick one diagram from Plant Physiology, draw it roughly, and label at least 5 parts from memory."
  },
  parents: {
    siblingAdvice: "I know the 'Sharma ji ka beta' comparisons and parental expectations feel like a mountain on your chest. But remember, their anxiety comes from love and fear, even if they express it terribly. They want you secure. Focus on what you can control—your effort, not their reactions.",
    personalizedCoping: "Set boundaries politely. Inform your parents of your study schedule and mock test dates beforehand, and share small wins (like completing a chapter) so they feel involved without hovering.",
    mindfulnessExercise: "Coherent breathing (inhale 5s, exhale 5s) to calm the nervous system.",
    tenMinuteAction: "Go out, drink a glass of water, and tell your parents one concept you learned today in simple language. It will reassure them and build connection."
  },
  burnout: {
    siblingAdvice: "Studying 14 hours a day with 4 hours of sleep is a recipe for disaster. Active, focused study of 8 hours is 10x better than 14 hours of staring blankly at a page. You are a human being, not a machine. Recharge your batteries.",
    personalizedCoping: "Strictly implement the Pomodoro technique (50 mins study, 10 mins break). During breaks, step away from screens entirely. No social media, no YouTube. Walk, stretch, drink water.",
    mindfulnessExercise: "5-minute Box Breathing to reset cognitive overload.",
    tenMinuteAction: "Step outside or look out of a window. Focus on a distant object for 2 minutes to rest your ciliary eye muscles."
  },
  default: {
    siblingAdvice: "This exam is a milestone, not your final destination. I know it feels like your entire life depends on this rank, but trust me, it doesn't. Life is incredibly vast, and successful people come from all paths. Do your best, let go of the rest.",
    personalizedCoping: "Review your study calendar and identify your peak concentration hours. Protect those hours from all distractions and use them for your hardest subjects.",
    mindfulnessExercise: "3-minute Box Breathing (Inhale 4, Hold 4, Exhale 4, Hold 4).",
    tenMinuteAction: "Close your books for 5 minutes, walk around your room, and stretch your neck and back."
  }
};

export const getMockResponse = (journalText, examName = "JEE") => {
  const text = journalText.toLowerCase();
  let selected = MOCK_COPING_RESOURCES.default;
  let category = "general";

  if (text.includes("chemistry") || text.includes("organic") || text.includes("inorganic") || text.includes("reaction")) {
    selected = MOCK_COPING_RESOURCES.chemistry;
    category = "chemistry";
  } else if (text.includes("physics") || text.includes("formula") || text.includes("mechanics") || text.includes("hc verma")) {
    selected = MOCK_COPING_RESOURCES.physics;
    category = "physics";
  } else if (text.includes("math") || text.includes("calculus") || text.includes("integration") || text.includes("algebra")) {
    selected = MOCK_COPING_RESOURCES.math;
    category = "math";
  } else if (text.includes("biology") || text.includes("botany") || text.includes("zoology") || text.includes("ncert") || text.includes("neet")) {
    selected = MOCK_COPING_RESOURCES.biology;
    category = "biology";
  } else if (text.includes("parent") || text.includes("father") || text.includes("mother") || text.includes("pressure") || text.includes("family") || text.includes("expectation")) {
    selected = MOCK_COPING_RESOURCES.parents;
    category = "parents";
  } else if (text.includes("burnout") || text.includes("tired") || text.includes("exhausted") || text.includes("sleep") || text.includes("give up") || text.includes("quitting")) {
    selected = MOCK_COPING_RESOURCES.burnout;
    category = "burnout";
  }

  // Detect critical issues
  const isCritical = text.includes("suicide") || text.includes("self harm") || text.includes("kill myself") || text.includes("end my life") || text.includes("hopeless") && (text.includes("live") || text.includes("die") || text.includes("quit"));

  // Estimate mock mood score based on category
  let moodScore = 7;
  if (isCritical) moodScore = 1;
  else if (category === "burnout") moodScore = 3;
  else if (category === "parents") moodScore = 4;
  else if (category !== "general") moodScore = 5;

  return {
    analysis: {
      stressTriggers: category === "parents" ? "Parental expectations and comparison anxiety" : category === "burnout" ? "Cognitive exhaustion and sleep deprivation" : `Academic anxiety related to ${category} in ${examName} prep.`,
      emotionalPatterns: text.includes("fail") ? "Fear of failure & Catastrophizing" : text.includes("perfect") ? "Perfectionism & All-or-nothing thinking" : "High cognitive load and situational stress",
      siblingAdvice: selected.siblingAdvice,
      personalizedCoping: selected.personalizedCoping,
      mindfulnessExercise: selected.mindfulnessExercise,
      tenMinuteAction: selected.tenMinuteAction,
      isCritical: isCritical,
      moodScore: moodScore
    }
  };
};
