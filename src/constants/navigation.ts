import { Bot, Code, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type View = 'agents' | 'hooks' | 'rules';

export interface NavItem {
  id: View;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'hooks', label: 'Hooks', icon: Code },
  { id: 'rules', label: 'Rules', icon: FileText },
];
