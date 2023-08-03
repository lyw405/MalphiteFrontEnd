type ValueType =
  | "Undefined"
  | "Number"
  | "Object"
  | "Array"
  | "String"
  | "Boolean"
  | "Function"
  | "RegExp"
  | "Date"
  | "Null";

export function getType(value: any): ValueType {
  const t: any = Object.prototype.toString.call(value).slice(8, -1);
  return t;
}
