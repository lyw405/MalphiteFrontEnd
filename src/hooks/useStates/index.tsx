import { useReducer } from "react";

function objectReducer(state: any, value: any) {
  return { ...state, ...value };
}

export default function useStates<T>(defaultValue: T) {
  return useReducer<(s: T, v: Partial<T>) => T>(objectReducer, defaultValue);
}
