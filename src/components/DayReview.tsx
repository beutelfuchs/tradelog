import { ComplianceMeter } from './ComplianceMeter';
import { TradeList } from './TradeList';
import type { DayLog, Rule } from '../types';

interface Props {
  dayLog: DayLog;
  rules: Rule[];
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  hasNewer: boolean;
  hasOlder: boolean;
}

export function DayReview({ dayLog, rules, onSwipeLeft, onSwipeRight, hasNewer, hasOlder }: Props) {
  const passedCount = dayLog.trades.filter((t) => t.passed).length;
  const score = dayLog.trades.length === 0
    ? null
    : passedCount / dayLog.trades.length;

  const dateLabel = new Date(dayLog.date + 'T12:00:00').toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="day-review">
      <header className="day-header">
        <button
          className="btn-icon nav-arrow"
          onClick={onSwipeRight}
          disabled={!hasOlder}
        >
          ‹
        </button>
        <h1 className="day-review-date">{dateLabel}</h1>
        <button
          className="btn-icon nav-arrow"
          onClick={onSwipeLeft}
          disabled={!hasNewer}
        >
          ›
        </button>
      </header>

      <div className="meter-row">
        <ComplianceMeter
          score={score}
          passedCount={passedCount}
          totalCount={dayLog.trades.length}
        />
        <span className={`market-toggle ${dayLog.marketHot ? 'hot' : 'cold'}`}>
          {dayLog.marketHot ? 'HOT' : 'COLD'}
        </span>
      </div>

      {dayLog.focusArea && (
        <div className="focus-bar">
          <span className="focus-label">Focus:</span> {dayLog.focusArea}
        </div>
      )}

      <TradeList trades={dayLog.trades} rules={rules} />

      {dayLog.trades.length === 0 && (
        <div className="trade-list-empty">No trades on this day</div>
      )}
    </div>
  );
}
