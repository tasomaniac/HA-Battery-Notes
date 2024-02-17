import { TemplateResult, html } from "lit";
import { HassEntity } from "home-assistant-js-websocket";
import { platform } from "./const";
import { Dictionary, HomeAssistant } from "./types";

export function getDomain(entity: string | HassEntity) {
  const entity_id: string =
    typeof entity == "string" ? entity : entity.entity_id;

  return String(entity_id.split(".").shift());
}

export function prettyPrint(input: string) {
  input = input.replace("_", " ");
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function computeName(entity: HassEntity) {
  if (!entity) return "(unrecognized entity)";
  if (entity.attributes && entity.attributes.friendly_name)
    return entity.attributes.friendly_name;
  else return String(entity.entity_id.split(".").pop());
}

export function getAlarmEntity(hass: HomeAssistant) {
  return String(hass.panels[platform].config!.entity_id);
}

export function isEqual(...arr: any[]) {
  return arr.every((e) => JSON.stringify(e) === JSON.stringify(arr[0]));
}

export function Unique<TValue>(arr: TValue[]) {
  let res: TValue[] = [];
  arr.forEach((item) => {
    if (
      !res.find((e) =>
        typeof item === "object" ? isEqual(e, item) : e === item
      )
    )
      res.push(item);
  });
  return res;
}

export function Without(array: any[], item: any) {
  return array.filter((e) => e !== item);
}

export function pick(
  obj: Dictionary<any> | null | undefined,
  keys: string[]
): Dictionary<any> {
  if (!obj) return {};
  return Object.entries(obj)
    .filter(([key]) => keys.includes(key))
    .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {});
}

export function flatten<U>(arr: U[][]): U[] {
  if ((arr as unknown as U[]).every((val) => !Array.isArray(val))) {
    return (arr as unknown as U[]).slice();
  }
  return arr.reduce(
    (acc, val) =>
      acc.concat(Array.isArray(val) ? flatten(val as unknown as U[][]) : val),
    []
  );
}

interface Omit {
  <T extends object, K extends [...(keyof T)[]]>(
    obj: T,
    ...keys: K
  ): {
    [K2 in Exclude<keyof T, K[number]>]: T[K2];
  };
}

export const omit: Omit = (obj, ...keys) => {
  const ret = {} as {
    [K in keyof typeof obj]: (typeof obj)[K];
  };
  let key: keyof typeof obj;
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
};

export function isDefined<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export function IsEqual(
  obj1: Record<string, any> | any[],
  obj2: Record<string, any> | any[]
) {
  if (obj1 === null || obj2 === null) return obj1 === obj2;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
      if (!IsEqual(obj1[key], obj2[key])) return false;
    } else if (obj1[key] !== obj2[key]) return false;
  }
  return true;
}

// export function Assign<Type>(obj: Type, changes: Partial<Type>): Type {
//   Object.entries(changes).forEach(([key, val]) => {
//     if (key in obj && typeof obj[key] == "object" && obj[key] !== null)
//       obj = { ...obj, [key]: Assign(obj[key], val) };
//     else obj = { ...obj, [key]: val };
//   });
//   return obj;
// }

export function sortAlphabetically(
  a: string | { name: string },
  b: string | { name: string }
) {
  const stringVal = (s: string | { name: string }) =>
    typeof s === "object" ? stringVal(s.name) : s.trim().toLowerCase();
  return stringVal(a) < stringVal(b) ? -1 : 1;
}

export function computeDomain(entityId: string): string {
  return entityId.substr(0, entityId.indexOf("."));
}

export function computeEntity(entityId: string): string {
  return entityId.substr(entityId.indexOf(".") + 1);
}