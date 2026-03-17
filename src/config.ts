import type { AppConfig } from './types';

export const defaultConfig: AppConfig = {
  reminders: [
    { id: 'r1', text: 'Daily max loss $50' },
    { id: 'r2', text: 'Review past trades' },
    { id: 'r3', text: 'Single account re-charge/month' },
    { id: 'r4', text: 'Breakout or bailout' },
    { id: 'r5', text: 'Hard out on break of support level' },
    { id: 'r6', text: 'Giving back 50% profit → EoD' },
    { id: 'r7', text: 'Green 2 red → EoD' },
  ],
  rules: [
    { id: 'rule1', text: 'Most obvious stock atm?' },
    { id: 'rule2', text: 'Breakout or bailout?' },
  ],
};
