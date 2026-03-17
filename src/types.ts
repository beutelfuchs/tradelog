export interface Reminder {
  id: string;
  text: string;
}

export interface Rule {
  id: string;
  text: string;
}

export interface Trade {
  id: string;
  symbol: string;
  timestamp: string;
  ruleResults: Record<string, boolean>;
  passed: boolean;
}

export interface DayLog {
  date: string;
  remindersAcknowledged: boolean;
  trades: Trade[];
}

export interface AppConfig {
  reminders: Reminder[];
  rules: Rule[];
}
