import { ReminderChecklist } from './components/ReminderChecklist';
import { TradingDay } from './components/TradingDay';
import { useTradingDay } from './hooks/useTradingDay';

export default function App() {
  const {
    dayLog,
    config,
    setConfig,
    allLogs,
    setAllLogs,
    acknowledgeReminders,
    addTrade,
    complianceScore,
  } = useTradingDay();

  if (!dayLog.remindersAcknowledged) {
    return <ReminderChecklist reminders={config.reminders} onAcknowledge={acknowledgeReminders} />;
  }

  return (
    <TradingDay
      dayLog={dayLog}
      config={config}
      setConfig={setConfig}
      allLogs={allLogs}
      setAllLogs={setAllLogs}
      complianceScore={complianceScore}
      addTrade={addTrade}
    />
  );
}
