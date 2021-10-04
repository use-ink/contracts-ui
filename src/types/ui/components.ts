import { UseFormField } from "./hooks";
import { SimpleSpread } from "./util";

export interface OptionProps<T> {
  option: DropdownOption<T>;
  isPlaceholder?: boolean;
  isSelected?: boolean;
}

export interface DropdownOption<T> {
  value: T;
  name: React.ReactNode;
}

export type DropdownProps<T> = SimpleSpread<
  React.HTMLAttributes<HTMLDivElement>,
  UseFormField<T> & {
    button?: React.ComponentType<OptionProps<T>>,
    isDisabled?: boolean;
    option?: React.ComponentType<OptionProps<T>>,
    options?: DropdownOption<T>[];
  }
>