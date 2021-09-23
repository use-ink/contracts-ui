import { BN_ONE, BN_TEN, BN_TWO, BN_ZERO, isBn, isNumber } from "@polkadot/util";
import BN from "bn.js";
import React from "react";
import { useFormField } from "./useFormField";
import type { ApiPromise, UseBalance, Validation } from "types";
import { useCanvas } from "ui/contexts/CanvasContext";

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

export function toSats (api: ApiPromise, balance: BN): BN {
  return balance.mul(BN_TEN.pow(new BN(api.registry.chainDecimals)));
}

export function fromSats (api: ApiPromise, sats: BN): BN {
  return sats.div(BN_TEN.pow(new BN(api.registry.chainDecimals)));
}

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
  const { api } = useCanvas();
  const balance = useFormField<BN | null | undefined>(
    isBn(initialValue) ? initialValue : toBalance(initialValue, api!),
    (value) => validate(value, { isZeroable, maxValue })
  );

  return balance;
}