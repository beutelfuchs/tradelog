import { useState, useCallback, useMemo } from 'react';
import { ReminderChecklist } from './components/ReminderChecklist';
import { TradingDay } from './components/TradingDay';
import { DayReview } from './components/DayReview';
import { useTradingDay } from './hooks/useTradingDay';
import { useSwipe } from './hooks/useSwipe';

export default function App() {
  const {
    dayLog,
    config,
    setConfig,
    allLogs,
    setAllLogs,
    acknowledgeReminders,
    setMarketHot,
    addTrade,
    complianceScore,
  } = useTradingDay();

  // null = viewing today, number = index into sorted history
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const sortedLogs = useMemo(
    () => [...allLogs].sort((a, b) => a.date.localeCompare(b.date)),
    [allLogs]
  );

  const goOlder = useCallback(() => {
    if (historyIndex === null) {
      // From today, go to most recent history entry
      if (sortedLogs.length > 0) {
        setHistoryIndex(sortedLogs.length - 1);
      }
    } else if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex, sortedLogs.length]);

  const goNewer = useCallback(() => {
    if (historyIndex !== null) {
      if (historyIndex >= sortedLogs.length - 1) {
        setHistoryIndex(null); // back to today
      } else {
        setHistoryIndex(historyIndex + 1);
      }
    }
  }, [historyIndex, sortedLogs.length]);

  const swipeHandlers = useSwipe(goOlder, goNewer);

  if (!dayLog.remindersAcknowledged && historyIndex === null) {
    return <ReminderChecklist reminders={config.reminders} onAcknowledge={acknowledgeReminders} />;
  }

  // Viewing a past day
  if (historyIndex !== null && sortedLogs[historyIndex]) {
    return (
      <div {...swipeHandlers}>
        <DayReview
          dayLog={sortedLogs[historyIndex]}
          rules={config.rules}
          onSwipeLeft={goNewer}
          onSwipeRight={goOlder}
          hasNewer={true}
          hasOlder={historyIndex > 0}
        />
      </div>
    );
  }

  // Viewing today
  return (
    <div {...swipeHandlers}>
      <TradingDay
        dayLog={dayLog}
        config={config}
        setConfig={setConfig}
        allLogs={allLogs}
        setAllLogs={setAllLogs}
        complianceScore={complianceScore}
        setMarketHot={setMarketHot}
        addTrade={addTrade}
      />
    </div>
  );
}
