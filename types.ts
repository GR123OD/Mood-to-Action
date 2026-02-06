
export interface Biometrics {
  heartRate: number;
  hrv: number;
  sleepQuality: number; // 0-100
  sleepDuration: number; // hours
  stressLevel: number; // 0-100
  steps: number;
  meetingsDuration: number; // hours
}

export interface Recommendation {
  id: string;
  category: 'Food' | 'Media' | 'Wellness';
  title: string;
  description: string;
  reasoning: string;
  icon: string;
}

export interface MoodAnalysis {
  summary: string;
  dominantMood: string;
  recommendations: Recommendation[];
}
