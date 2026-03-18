import { useState } from 'react';
import type { Reminder } from '../types';

interface Props {
  reminders: Reminder[];
  onAcknowledge: (focusArea: string) => void;
}

export function ReminderChecklist({ reminders, onAcknowledge }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [focusArea, setFocusArea] = useState('');

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allChecked = reminders.length > 0 && reminders.every((r) => checked.has(r.id));

  return (
    <div className="reminder-screen">
      <h1>Daily Reminders</h1>
      <p className="subtitle">Acknowledge each reminder before trading</p>
      <ul className="reminder-list">
        {reminders.map((r) => (
          <li key={r.id} className="reminder-item" onClick={() => toggle(r.id)}>
            <span className={`checkbox ${checked.has(r.id) ? 'checked' : ''}`}>
              {checked.has(r.id) ? '✓' : ''}
            </span>
            <span className={checked.has(r.id) ? 'acknowledged' : ''}>{r.text}</span>
          </li>
        ))}
      </ul>
      <div className="focus-area">
        <label htmlFor="focus">Today's focus area</label>
        <input
          id="focus"
          type="text"
          className="input-field"
          placeholder="e.g. Only A+ setups, patience..."
          value={focusArea}
          onChange={(e) => setFocusArea(e.target.value)}
        />
      </div>
      <button className="btn-primary" disabled={!allChecked} onClick={() => onAcknowledge(focusArea)}>
        Start Trading Day
      </button>
    </div>
  );
}
