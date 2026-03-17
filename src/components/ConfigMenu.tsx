import { useState } from 'react';
import type { AppConfig, DayLog } from '../types';

interface Props {
  config: AppConfig;
  setConfig: (c: AppConfig | ((prev: AppConfig) => AppConfig)) => void;
  allLogs: DayLog[];
  currentDay: DayLog;
  setAllLogs: (logs: DayLog[] | ((prev: DayLog[]) => DayLog[])) => void;
  onClose: () => void;
}

export function ConfigMenu({ config, setConfig, allLogs, currentDay, setAllLogs, onClose }: Props) {
  const [newReminder, setNewReminder] = useState('');
  const [newRule, setNewRule] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const addReminder = () => {
    if (!newReminder.trim()) return;
    setConfig((prev) => ({
      ...prev,
      reminders: [...prev.reminders, { id: crypto.randomUUID(), text: newReminder.trim() }],
    }));
    setNewReminder('');
  };

  const addRule = () => {
    if (!newRule.trim()) return;
    setConfig((prev) => ({
      ...prev,
      rules: [...prev.rules, { id: crypto.randomUUID(), text: newRule.trim() }],
    }));
    setNewRule('');
  };

  const deleteReminder = (id: string) => {
    setConfig((prev) => ({ ...prev, reminders: prev.reminders.filter((r) => r.id !== id) }));
  };

  const deleteRule = (id: string) => {
    setConfig((prev) => ({ ...prev, rules: prev.rules.filter((r) => r.id !== id) }));
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (type: 'reminders' | 'rules') => {
    if (!editingId || !editText.trim()) return;
    setConfig((prev) => ({
      ...prev,
      [type]: prev[type].map((item) =>
        item.id === editingId ? { ...item, text: editText.trim() } : item
      ),
    }));
    setEditingId(null);
    setEditText('');
  };

  const exportData = () => {
    const data = { config, logs: [...allLogs, currentDay] };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tradelog-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (data.config) setConfig(data.config);
        if (data.logs) setAllLogs(data.logs);
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="config-overlay" onClick={onClose}>
      <div className="config-menu" onClick={(e) => e.stopPropagation()}>
        <div className="config-header">
          <h2>Settings</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <section>
          <h3>Reminders</h3>
          <ul className="config-list">
            {config.reminders.map((r) => (
              <li key={r.id}>
                {editingId === r.id ? (
                  <div className="edit-row">
                    <input value={editText} onChange={(e) => setEditText(e.target.value)} className="input-field" />
                    <button className="btn-sm" onClick={() => saveEdit('reminders')}>Save</button>
                  </div>
                ) : (
                  <div className="config-item">
                    <span>{r.text}</span>
                    <div className="config-actions">
                      <button className="btn-sm" onClick={() => startEdit(r.id, r.text)}>Edit</button>
                      <button className="btn-sm btn-danger" onClick={() => deleteReminder(r.id)}>Del</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="add-row">
            <input
              placeholder="New reminder..."
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addReminder()}
              className="input-field"
            />
            <button className="btn-sm" onClick={addReminder}>Add</button>
          </div>
        </section>

        <section>
          <h3>Trade Rules</h3>
          <ul className="config-list">
            {config.rules.map((r) => (
              <li key={r.id}>
                {editingId === r.id ? (
                  <div className="edit-row">
                    <input value={editText} onChange={(e) => setEditText(e.target.value)} className="input-field" />
                    <button className="btn-sm" onClick={() => saveEdit('rules')}>Save</button>
                  </div>
                ) : (
                  <div className="config-item">
                    <span>{r.text}</span>
                    <div className="config-actions">
                      <button className="btn-sm" onClick={() => startEdit(r.id, r.text)}>Edit</button>
                      <button className="btn-sm btn-danger" onClick={() => deleteRule(r.id)}>Del</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="add-row">
            <input
              placeholder="New rule..."
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRule()}
              className="input-field"
            />
            <button className="btn-sm" onClick={addRule}>Add</button>
          </div>
        </section>

        <section>
          <h3>Data</h3>
          <div className="data-actions">
            <button className="btn-primary" onClick={exportData}>Export Data</button>
            <label className="btn-primary import-btn">
              Import Data
              <input type="file" accept=".json" onChange={importData} hidden />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
