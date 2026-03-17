interface Props {
  score: number | null; // 0-1 or null for no trades
  passedCount: number;
  totalCount: number;
}

export function ComplianceMeter({ score, passedCount, totalCount }: Props) {
  const pct = score === null ? 50 : Math.round(score * 100);

  let colorClass = 'neutral';
  if (score !== null) {
    if (score >= 0.8) colorClass = 'green';
    else if (score >= 0.5) colorClass = 'yellow';
    else colorClass = 'red';
  }

  return (
    <div className="compliance-meter">
      <div className="meter-labels">
        <span>0%</span>
        <span className="meter-score">
          {score === null
            ? 'No trades yet'
            : `${passedCount}/${totalCount} trades compliant`}
        </span>
        <span>100%</span>
      </div>
      <div className="meter-track">
        <div
          className={`meter-fill ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
