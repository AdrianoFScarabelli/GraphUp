import {
  Briefcase,
  Car,
  Circle,
  Ellipsis,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  House,
  Laptop,
  Plus,
  Repeat,
  TrendingUp,
  Utensils,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Car,
  Ellipsis,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  House,
  Laptop,
  Plus,
  Repeat,
  TrendingUp,
  Utensils,
};

interface CategoryIconProps {
  name: string;
  size?: number;
}

export function CategoryIcon({ name, size = 18 }: CategoryIconProps) {
  const Icon = iconMap[name] ?? Circle;
  return <Icon size={size} />;
}