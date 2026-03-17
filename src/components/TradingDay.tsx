import { useState } from 'react';
import { ComplianceMeter } from './ComplianceMeter';
import { TradeInput } from './TradeInput';
import { TradeList } from './TradeList';
import { ConfigMenu } from './ConfigMenu';
import type { DayLog, AppConfig } from '../types';

interface Props {
  dayLog: DayLog;
  config: AppConfig;
  setConfig: (c: AppConfig | ((prev: AppConfig) => AppConfig)) => void;
  allLogs: DayLog[];
  setAllLogs: (logs: DayLog[] | ((prev: DayLog[]) => DayLog[])) => void;
  complianceScore: number | null;
  addTrade: (trade: { symbol: string; timestamp: string; ruleResults: Record<string, boolean> }) => void;
}

export function TradingDay({ dayLog, config, setConfig, allLogs, setAllLogs, complianceScore, addTrade }: Props) {
  const [showConfig, setShowConfig] = useState(false);
  const passedCount = dayLog.trades.filter((t) => t.passed).length;

  return (
    <div className="trading-day">
      <header className="day-header">
        <h1>TradeLog</h1>
        <button className="btn-icon gear" onClick={() => setShowConfig(true)} title="Settings">
          ⚙
        </button>
      </header>

      <ComplianceMeter
        score={complianceScore}
        passedCount={passedCount}
        totalCount={dayLog.trades.length}
      />

      <TradeInput rules={config.rules} onSubmit={addTrade} />

      <TradeList trades={dayLog.trades} rules={config.rules} />

      {showConfig && (
        <ConfigMenu
          config={config}
          setConfig={setConfig}
          allLogs={allLogs}
          currentDay={dayLog}
          setAllLogs={setAllLogs}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  );
}
