import { useState } from 'react';
import type { Rule } from '../types';

interface Props {
  rules: Rule[];
  onSubmit: (trade: { symbol: string; timestamp: string; ruleResults: Record<string, boolean> }) => void;
}

function localISOString() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function TradeInput({ rules, onSubmit }: Props) {
  const [symbol, setSymbol] = useState('');
  const [timestamp, setTimestamp] = useState(localISOString);
  const [ruleChecks, setRuleChecks] = useState<Record<string, boolean>>({});

  const toggleRule = (id: string) => {
    setRuleChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;
    const ruleResults: Record<string, boolean> = {};
    rules.forEach((r) => {
      ruleResults[r.id] = !!ruleChecks[r.id];
    });
    onSubmit({ symbol: symbol.trim().toUpperCase(), timestamp, ruleResults });
    setSymbol('');
    setTimestamp(localISOString());
    setRuleChecks({});
  };

  return (
    <form className="trade-input" onSubmit={handleSubmit}>
      <div className="trade-fields">
        <input
          type="text"
          placeholder="Symbol (e.g. AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="input-field"
        />
        <input
          type="datetime-local"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="rule-checks">
        {rules.map((r) => (
          <label key={r.id} className="rule-check-item">
            <input
              type="checkbox"
              checked={!!ruleChecks[r.id]}
              onChange={() => toggleRule(r.id)}
            />
            <span>{r.text}</span>
          </label>
        ))}
      </div>
      <button type="submit" className="btn-primary" disabled={!symbol.trim()}>
        Log Trade
      </button>
    </form>
  );
}
