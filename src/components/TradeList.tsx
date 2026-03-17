import { useState } from 'react';
import type { Trade, Rule } from '../types';

interface Props {
  trades: Trade[];
  rules: Rule[];
}

export function TradeList({ trades, rules }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (trades.length === 0) {
    return <div className="trade-list-empty">No trades logged today</div>;
  }

  return (
    <div className="trade-list">
      {trades.map((t) => (
        <div key={t.id} className={`trade-row ${t.passed ? 'passed' : 'failed'}`} onClick={() => toggle(t.id)}>
          <div className="trade-summary">
            <span className="trade-icon">{t.passed ? '✓' : '✗'}</span>
            <span className="trade-symbol">{t.symbol}</span>
            <span className="trade-time">
              {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          {expanded.has(t.id) && (
            <div className="trade-details">
              {rules.map((r) => (
                <div key={r.id} className="rule-result">
                  <span className={t.ruleResults[r.id] ? 'rule-pass' : 'rule-fail'}>
                    {t.ruleResults[r.id] ? '✓' : '✗'}
                  </span>
                  <span>{r.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
