export const getStrengthDataForExercise = (history: any[], exerciseName: string) => {
  return history
    .map(session => {
      // Find the best set for the specific exercise in this session
      const exerciseSets = session.data.filter((s: any) => s.exercise === exerciseName);
      
      if (exerciseSets.length === 0) return null;

      const max1RM = exerciseSets.reduce((max: number, set: any) => {
        const weight = parseFloat(set.weight);
        const reps = parseInt(set.reps);
        if (isNaN(weight) || isNaN(reps)) return max;
        
        // Brzycki Formula
        const oneRM = weight * (36 / (37 - reps));
        return oneRM > max ? oneRM : max;
      }, 0);

      return {
        value: Math.round(max1RM),
        label: session.date.split('/')[0] + '/' + session.date.split('/')[1], // Short date (DD/MM)
        fullDate: session.date
      };
    })
    .filter(item => item !== null);
};