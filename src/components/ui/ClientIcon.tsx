'use client';

import {
  BarChart,
  Bot,
  Calculator,
  LayoutTemplate,
  PanelLeft,
  Settings,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Target,
  Shield,
} from 'lucide-react';

// Define a static object of icon components
const iconComponents = {
  marketing: BarChart,
  dashboard: PanelLeft,
  calculator: Calculator,
  design: LayoutTemplate,
  ai: Bot,
  settings: Settings,
  money: DollarSign,
  cart: ShoppingCart,
  chart: TrendingUp,
  conversion: Target,
  shield: Shield,
} as const;

// Type for the icon keys
export type IconKey = keyof typeof iconComponents;

interface ClientIconProps {
  type: IconKey;
  size?: number;
  className?: string;
}

export default function ClientIcon({ type, size = 24, className }: ClientIconProps) {
  // Get the component for the specified icon type
  const IconComponent = iconComponents[type];

  // Fall back to Settings icon if the requested icon type doesn't exist
  if (!IconComponent) {
    console.warn(`Icon type "${type}" not found, using fallback`);
    return <Settings size={size} className={className} />;
  }

  // Render the icon component
  return <IconComponent size={size} className={className} />;
}




