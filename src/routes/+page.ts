import type { Entry } from "../lib/entry/model"

export type LoadData = {
  entries: Array<Entry>
}

export async function load(): Promise<LoadData> {
  const entries: Entry[] = [
    { id: "1", value: 1, description: "one", date: new Date() },
    { id: "2", value: 2, description: "two", date: new Date() },
  ]

  return { entries }
}
