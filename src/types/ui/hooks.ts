import type { VoidFn } from "../substrate";
import React from "react"

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type UseToggle = [boolean, VoidFn, SetState<boolean>];