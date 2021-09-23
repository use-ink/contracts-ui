import { BN_ONE, BN_TEN, BN_TWO, BN_ZERO, isBn, isNumber } from "@polkadot/util";
import BN from "bn.js";
import React from "react";
import { useFormField, UseFormField, Validation } from "./useFormField";
// import { useCanvas } from "ui/contexts";
import { ApiPromise } from "types";
import { useCanvas } from "ui/contexts";

export type UseBalance = UseFormField<BN | null | undefined>;

export function fromBalance (value: BN | null): string {
  if (!value) {
    return '';
  }

  return value.toString();
}

export function toBalance (value: string | number, api: ApiPromise): BN {
  const asString = isNumber(value) ? value.toString() : value;

  const isDecimalValue = /^(\d+)\.(\d+)$/.exec(asString);

  if (isDecimalValue) {

    const div = new BN(asString.replace(/\.\d*$/, ''));
    const modString = asString.replace(/^\d+\./, '').substr(0, api.registry.chainDecimals[0]);
    const mod = new BN(modString);

    return div
      .add(mod.mul(BN_TEN.pow(BN_ZERO.subn(modString.length))));
  } else {
    return new BN(asString.replace(/[^\d]/g, ''));
  }
}

// type Value = [string | number, BN]

type BitLength = 8 | 16 | 32 | 64 | 128 | 256;

const DEFAULT_BITLENGTH = 128;

interface ValidateOptions {
  bitLength?: BitLength
  isZeroable?: boolean;
  maxValue?: BN;
}

function getGlobalMaxValue (bitLength?: number): BN {
  return BN_TWO.pow(new BN(bitLength || DEFAULT_BITLENGTH)).isub(BN_ONE);
}

function validate (value: BN | null | undefined, { bitLength = DEFAULT_BITLENGTH, isZeroable, maxValue }: ValidateOptions): Validation {
  let validation: React.ReactNode;
  let isError = false;

  if (!value) {
    isError = true;
    return {
      isError
    };
  }

  if (value?.lt(BN_ZERO)) {
    isError = true;
    validation = 'Value cannot be negative'
  }

  if (value?.gt(getGlobalMaxValue(bitLength))) {
    isError = true;
    validation = 'Value exceeds global maximum'
  }

  if (!isZeroable && value?.isZero()) {
    isError = true;
    validation = 'Value cannot be zero'
  }

  if (value && value?.bitLength() > (bitLength || DEFAULT_BITLENGTH)) {
    isError = true;
    validation = 'Value\'s bitlength is too high';
  }

  if (maxValue && maxValue.gtn(0) && value?.gt(maxValue)) {
    isError = true;
    validation = `Value cannot exceed ${maxValue?.toNumber()}`
  }

  return {
    isError,
    isValid: !isError,
    validation
  };
}

export function useBalance (initialValue: BN | string | number = 0, isZeroable = false, maxValue?: BN ): UseBalance {
  // const canvas = useCanvas();
  // const tokenDecimals = new BN(canvas.tokenDecimals);

  const { api } = useCanvas();
  const balance = useFormField<BN | null | undefined>(
    isBn(initialValue) ? initialValue : toBalance(initialValue, api!),
    (value) => validate(value, { isZeroable, maxValue })
  );

  // const setString = useCallback(
  //   (newString: string) => {
  //     try {
  //       const newBn = toBalance(newString, tokenDecimals, canvas.api!);

  //       balance.onChange([newString, newBn]);
  //     } finally {

  //     }
  //   },
  //   []
  // )

  // const [asString, setString] = useState(fromBalance(balance.value as BN, tokenDecimals));

  // useEffect(
  //   (): void => {
  //     balance.onChange(toBalance(asString, tokenDecimals))
  //   },
  //   [asString]
  // )

  return balance;
}