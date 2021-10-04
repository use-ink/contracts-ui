export type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;

export type OrFalsy<T> = T | null | undefined;

export type OrNull<T> = T | null;

export type OrUndef<T> = T | undefined;