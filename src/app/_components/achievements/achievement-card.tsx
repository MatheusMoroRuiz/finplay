"use client";

import { Award, Trophy, Star } from "lucide-react";

const ICONS: any = {
  medal: <Award size={34} className="text-yellow-400" />,
  trophy: <Trophy size={34} className="text-yellow-500" />,
  star: <Star size={34} className="text-yellow-300" />,
};

export default function AchievementCard({
  title,
  icon,
  points,
  date,
}: {
  title: string;
  icon: string;
  points: number;
  date: Date;
}) {
  return (
    <div
      className="
        flex items-center gap-4 p-5 rounded-xl 
        bg-neutral-900/40 border border-neutral-800
        hover:border-yellow-500 transition
        shadow-sm hover:shadow-md
      "
    >
      <div className="p-3 rounded-full bg-neutral-800">
        {ICONS[icon] ?? ICONS["star"]}
      </div>

      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {date.toLocaleDateString("pt-BR")}
        </p>
      </div>

      <span className="ml-auto text-yellow-400 font-bold text-sm">
        +{points} XP
      </span>
    </div>
  );
}
