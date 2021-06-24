// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors
export function chooseOne<T>(items: T[]): [T, number] {
  const index = Math.floor(Math.random() * items.length);

  return [items[index], index];
}

export function chooseMany<T>(items: T[]): T[] {
  const size = Math.max(1, Math.floor(Math.random() * items.length));

  const shuffled = items.slice(0);
  let i = items.length, temp: T, index: number;

  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }

  return shuffled.slice(0, size);
}