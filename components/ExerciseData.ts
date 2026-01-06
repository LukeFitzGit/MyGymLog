export type Category = 'push' | 'pull' | 'legs';

export interface ExerciseDef {
  name: string;
  initials: string;
  category: Category;
}

export const EXERCISE_LIST: ExerciseDef[] = [
  //push
  { name: 'Bench Press', initials: 'BP', category: 'push' },
  { name: 'Cable Lateral Raise', initials: 'CLR', category: 'push' },
  { name: 'Cable Flys', initials: 'CF', category: 'push' },
  { name: 'Decline Bench Press', initials: 'DBP', category: 'push' },
  { name: 'Dumbbell Bench Press', initials: 'DBP', category: 'push' },
  { name: 'Dumbbell Flys', initials: 'DBF', category: 'push' },
  { name: 'Dips', initials: 'D', category: 'push' },
  { name: 'Incline Dumbbell Press', initials: 'IDP', category: 'push' },
  { name: 'Incline Bench Press', initials: 'IBP', category: 'push' },
  { name: 'Lateral Raise', initials: 'LR', category: 'push' },
  { name: 'Overhead Press', initials: 'OHP', category: 'push' },
  { name: 'Push-ups', initials: 'PU', category: 'push' },
  { name: 'Triceps Pushdown', initials: 'TPD', category: 'push' },
  { name: 'Skullcrushers', initials: 'SC', category: 'push' },

  //pull
  { name: 'Barbell Row', initials: 'BR', category: 'pull' },
  { name: 'Back Row', initials: 'BR', category: 'pull' },
  { name: 'Bicep Curls', initials: 'BC', category: 'pull'},
  { name: 'Deadlift', initials: 'DL', category: 'pull' },
  { name: 'Face Pulls', initials: 'FP', category: 'pull' },
  { name: 'Hammer Curls', initials: 'HC', category: 'pull' },
  { name: 'Lat Pulldown', initials: 'LP', category: 'pull' },
  { name: 'Pull-ups', initials: 'PLU', category: 'pull' },
  { name: 'Seated Cable Row', initials: 'SCR', category: 'pull' },
  //legs
  { name: 'Bulgarian Split Squat', initials: 'BSS', category: 'legs' },
  { name: 'Calf Raise', initials: 'CR', category: 'legs'},
  { name: 'Hip Thrust', initials: 'HT', category: 'legs'},
  { name: 'Leg Extension', initials: 'LE', category: 'legs' },
  { name: 'Leg Press', initials: 'LP', category: 'legs'},
  { name: 'Leg Curl', initials: 'LC', category: 'legs'},
  { name: 'Romanian Deadlift', initials: 'RDL', category: 'legs' },
  { name: 'Squat', initials: 'SQ', category: 'legs' },
  { name: 'Split Squat', initials: 'SQ', category: 'legs' }
];

export const getMatches = (initials: string, preferredCategory?: Category): string[] => {
  const normalized = initials.toUpperCase().trim();
  if (!normalized) return [''];
  
  const matches = EXERCISE_LIST.filter(e => e.initials === normalized);
  if (matches.length === 0) return [initials];

  return matches
    .sort((a, b) => (a.category === preferredCategory ? -1 : 1))
    .map(e => e.name);
};