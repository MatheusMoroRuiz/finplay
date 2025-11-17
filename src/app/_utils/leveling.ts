export function xpForNextLevel(level: number) {
  return 150 + level * 50;
}

export function shouldLevelUp(xp: number, level: number) {
  return xp >= xpForNextLevel(level);
}
