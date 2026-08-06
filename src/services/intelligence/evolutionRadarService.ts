import { SkillTrajectory } from "./types";
import { getUserRealitySignals } from "./realitySignalService";

export async function calculateSkillTrajectories(userId: string): Promise<SkillTrajectory[]> {
  const signals = await getUserRealitySignals(userId);
  const skillMap: Map<string, {
    firstSeen: string;
    lastSeen: string;
    count: number;
    impacts: Set<string>;
  }> = new Map();

  signals.forEach(sig => {
    const skills = sig.payload.skillsExtracted || [];
    const dateStr = typeof sig.createdAt === 'string' ? sig.createdAt : new Date().toISOString();
    const contextStr = sig.payload.context || sig.payload.rawText || "Activité identifiée";

    skills.forEach(skill => {
      const existing = skillMap.get(skill);
      if (!existing) {
        skillMap.set(skill, {
          firstSeen: dateStr,
          lastSeen: dateStr,
          count: 1,
          impacts: new Set([contextStr])
        });
      } else {
        existing.count += 1;
        if (new Date(dateStr) < new Date(existing.firstSeen)) existing.firstSeen = dateStr;
        if (new Date(dateStr) > new Date(existing.lastSeen)) existing.lastSeen = dateStr;
        existing.impacts.add(contextStr);
      }
    });
  });

  const trajectories: SkillTrajectory[] = [];
  skillMap.forEach((data, skill) => {
    // Personal advisory velocity score calculation based solely on temporal frequency [0 - 100]
    const velocityScore = Math.min(100, Math.round(data.count * 25));
    let trend: 'emerging' | 'accelerating' | 'consolidated' = 'emerging';
    
    if (data.count >= 4) {
      trend = 'consolidated';
    } else if (data.count >= 2) {
      trend = 'accelerating';
    }

    trajectories.push({
      skill,
      firstDetectedAt: data.firstSeen,
      lastDetectedAt: data.lastSeen,
      occurrenceCount: data.count,
      velocityScore,
      associatedImpacts: Array.from(data.impacts).slice(0, 3),
      trend
    });
  });

  // Sort by velocity score descending
  return trajectories.sort((a, b) => b.velocityScore - a.velocityScore);
}
