
import { presetChallenges } from './challenges-data';
import { storage } from './storage';
import type { Challenge } from '@shared/schema';

export async function ensureActiveChallenge(): Promise<Challenge> {
  const activeChallenge = await storage.getActiveChallenge();
  
  if (activeChallenge) {
    // Check if the challenge has expired
    const now = new Date();
    if (new Date(activeChallenge.endDate) > now) {
      return activeChallenge;
    }
  }

  // Select a random challenge
  const randomChallenge = presetChallenges[Math.floor(Math.random() * presetChallenges.length)];
  
  // Set start and end dates (1 week duration)
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  // Create new active challenge
  const newChallenge = await storage.createChallenge({
    ...randomChallenge,
    isActive: true,
    startDate,
    endDate
  });

  return newChallenge;
}
