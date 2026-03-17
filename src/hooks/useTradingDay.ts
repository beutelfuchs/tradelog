import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { DayLog, Trade, AppConfig } from '../types';
import { defaultConfig } from '../config';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyDay(date: string): DayLog {
  return { date, remindersAcknowledged: false, trades: [] };
}

export function useTradingDay() {
  const [dayLog, setDayLog] = useLocalStorage<DayLog>('tradelog_day', emptyDay(todayStr()));
  const [config, setConfig] = useLocalStorage<AppConfig>('tradelog_config', defaultConfig);
  const [allLogs, setAllLogs] = useLocalStorage<DayLog[]>('tradelog_history', []);

  // If stored day doesn't match today, archive it and reset
  const today = todayStr();
  const currentDay = dayLog.date === today ? dayLog : emptyDay(today);
  if (dayLog.date !== today) {
    // Archive old day if it had trades
    if (dayLog.trades.length > 0 || dayLog.remindersAcknowledged) {
      setAllLogs((prev) => {
        const filtered = prev.filter((d) => d.date !== dayLog.date);
        return [...filtered, dayLog];
      });
    }
    setDayLog(emptyDay(today));
  }

  const acknowledgeReminders = useCallback(() => {
    setDayLog((prev) => ({ ...prev, remindersAcknowledged: true }));
  }, [setDayLog]);

  const addTrade = useCallback(
    (trade: Omit<Trade, 'id' | 'passed'>) => {
      const passed = config.rules.every((r) => trade.ruleResults[r.id] === true);
      const newTrade: Trade = {
        ...trade,
        id: crypto.randomUUID(),
        passed,
      };
      setDayLog((prev) => ({
        ...prev,
        trades: [newTrade, ...prev.trades],
      }));
    },
    [setDayLog, config.rules]
  );

  const complianceScore = currentDay.trades.length === 0
    ? null
    : currentDay.trades.filter((t) => t.passed).length / currentDay.trades.length;

  return {
    dayLog: currentDay,
    config,
    setConfig,
    allLogs,
    setAllLogs,
    acknowledgeReminders,
    addTrade,
    complianceScore,
  };
}
