import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Internal Tracking Module
 * Simple logger for internal module execution and debugging.
 * NOT a KAIROS ledger.
 */

export interface TrackingEntry {
  timestamp: string;
  moduleId: string;
  intent: string;
  version: string;
  tenantId?: string;
  metrics: {
    latency: number;
    confidence: number;
    decisionWeight: number;
  };
}

class InternalTracker {
  private entries: TrackingEntry[] = [];
  private currentTenantId: string | null = null;

  setTenant(tenantId: string) {
    this.currentTenantId = tenantId;
  }

  async log(entry: TrackingEntry) {
    const tenantId = entry.tenantId || this.currentTenantId || 'default';
    const entryWithTenant = {
      ...entry,
      tenantId
    };
    
    this.entries.push(entryWithTenant);
    console.log(`[Tracker][${tenantId}] Logged: ${entry.moduleId} (${entry.intent}) - Latency: ${entry.metrics.latency}ms`);

    // Persist to Firestore if tenantId is available and not a placeholder
    if (tenantId !== 'default' && tenantId !== 'default_tenant') {
      try {
        await addDoc(collection(db, `tenants/${tenantId}/logs`), {
          ...entryWithTenant,
          persistedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('[Tracker] Error persisting log to Firestore:', error);
      }
    }
  }

  getStats() {
    if (this.entries.length === 0) return null;

    const avgLatency = this.entries.reduce((acc, e) => acc + e.metrics.latency, 0) / this.entries.length;
    const avgConfidence = this.entries.reduce((acc, e) => acc + e.metrics.confidence, 0) / this.entries.length;

    return {
      totalEntries: this.entries.length,
      avgLatency: Math.round(avgLatency * 100) / 100,
      avgConfidence: Math.round(avgConfidence * 100) / 100,
      entries: this.entries
    };
  }

  clear() {
    this.entries = [];
  }
}

export const tracker = new InternalTracker();
