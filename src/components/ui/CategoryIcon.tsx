import * as Icons from "lucide-react";

interface Props {
  name: string;
  size?: number;
}

export function CategoryIcon({ name, size = 18 }: Props) {
  const Icon = (Icons as Record<string, any>)[name] ?? Icons.Circle;
  return <Icon size={size} />;
}