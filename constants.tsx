
import { Biometrics } from './types';

export const INITIAL_BIOMETRICS: Biometrics = {
  heartRate: 72,
  hrv: 55,
  sleepQuality: 82,
  sleepDuration: 7.5,
  stressLevel: 30,
  steps: 4500,
  meetingsDuration: 2,
};

export const MOOD_PRESETS = [
  {
    name: 'The "Burnt Out" Executive',
    data: {
      heartRate: 88,
      hrv: 32,
      sleepQuality: 45,
      sleepDuration: 4.5,
      stressLevel: 85,
      steps: 800,
      meetingsDuration: 7.5,
    }
  },
  {
    name: 'The "Restored" Athlete',
    data: {
      heartRate: 58,
      hrv: 85,
      sleepQuality: 95,
      sleepDuration: 9,
      stressLevel: 10,
      steps: 12000,
      meetingsDuration: 1,
    }
  },
  {
    name: 'The "Stagnant" Creator',
    data: {
      heartRate: 68,
      hrv: 60,
      sleepQuality: 70,
      sleepDuration: 6.5,
      stressLevel: 40,
      steps: 1200,
      meetingsDuration: 0,
    }
  }
];
