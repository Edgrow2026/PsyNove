import type { AppState, Booking, ClientProfile, Complaint, Psychiatrist, SystemConfig } from './store';

export type DatabaseSnapshot = Partial<
  Pick<AppState, 'psychiatrists' | 'clients' | 'bookings' | 'complaints' | 'config' | 'smsInbox'>
> & {
  hasDatabaseRows?: boolean;
};

async function requestDatabase<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'Database request failed.');
  }

  return result as T;
}

export function loadDatabaseSnapshot() {
  return requestDatabase<DatabaseSnapshot>('/api/database', {
    method: 'GET',
    cache: 'no-store',
  });
}

export function syncDatabaseAction(action: string, payload: unknown) {
  if (typeof window === 'undefined') return;

  void requestDatabase('/api/database', {
    method: 'POST',
    body: JSON.stringify({ action, payload }),
  }).catch((error) => {
    console.warn('PsyNova database sync failed:', error);
  });
}

export function saveFullDatabaseSnapshot(state: AppState) {
  syncDatabaseAction('replaceSnapshot', {
    psychiatrists: state.psychiatrists,
    clients: state.clients,
    bookings: state.bookings,
    complaints: state.complaints,
    config: state.config,
    smsInbox: state.smsInbox,
  });
}

export type SyncableRecord =
  | Psychiatrist
  | ClientProfile
  | Booking
  | Complaint
  | SystemConfig
  | AppState['smsInbox'][number];
