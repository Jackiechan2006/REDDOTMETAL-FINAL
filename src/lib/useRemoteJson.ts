"use client"

import { useEffect, useRef, useState } from "react"

export function useRemoteJson<T>(
  url: string,
  fallback: T,
  select: (payload: unknown) => T = (payload) => payload as T
) {
  const [data, setData] = useState<T>(fallback)
  const fallbackRef = useRef(fallback)
  const selectRef = useRef(select)

  useEffect(() => {
    fallbackRef.current = fallback
    selectRef.current = select
  }, [fallback, select])

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const response = await fetch(url, { cache: "no-store" })
        const payload = await response.json()
        if (active) setData(selectRef.current(payload))
      } catch {
        if (active) setData(fallbackRef.current)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [url])

  return data
}