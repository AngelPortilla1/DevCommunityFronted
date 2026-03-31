export interface Session {
  session_id: string;
  user_id: number;
  ip_address: string;
  user_agent: string;
  device_info: {
    browser?: string;
    os?: string;
    device?: string;
    is_mobile?: boolean;
    is_tablet?: boolean;
    is_pc?: boolean;
  } | null;
  last_activity: string;
  expires_at: string;
  is_suspicious: boolean;
  suspicion_reasons: string[];
  is_current?: boolean;
}

export interface SessionMetrics {
  total_active_sessions: number;
  suspicious_sessions: number;
  devices_used: Record<string, number>;
  browsers_used: Record<string, number>;
  latest_activity: string | null;
}
