import React from 'react';
import { LucideIcon, Home, DollarSign, FileText, Settings, BarChart3, Users, Package } from 'lucide-react';

export type IconKey = string;

interface ClientIconProps {
  Icon?: LucideIcon;
  type?: string;
  className?: string;
  size?: number;
}

const iconMap: Record<string, LucideIcon> = {
  dashboard: Home,
  money: DollarSign,
  design: FileText,
  settings: Settings,
  chart: BarChart3,
  users: Users,
  package: Package,
  // Add more mappings as needed
};

export const ClientIcon: React.FC<ClientIconProps> = ({ 
  Icon, 
  type,
  className = '', 
  size = 24 
}) => {
  const IconComponent = Icon || (type ? iconMap[type] : null) || Home;
  return <IconComponent className={className} size={size} />;
};



