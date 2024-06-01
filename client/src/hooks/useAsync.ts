import { useCallback, useEffect, useState } from "react";

interface AsyncState<T> {
  loading: boolean;
  error?: Error;
  value?: T;
  execute?: (...params: any[]) => Promise<T>
}

export function useAsync<T>(func: (...params: any[]) => Promise<T>, dependencis: any[] = []): AsyncState<T> {
  const { execute, ...state } = useAsyncInternal(func, dependencis, true)

  useEffect(() => {
    execute!()
  }, [execute])
  return state
}

export function useAsyncFn<T>(func: (...params: any[]) => Promise<T>, dependencis: any[] = []): AsyncState<T> {
  return useAsyncInternal(func, dependencis, false)
}

function useAsyncInternal<T>(func: (...params: any[]) => Promise<T>, dependencis: any[] = [], initialLoading = false): AsyncState<T> {
  const [loading, setLoading] = useState(initialLoading)
  const [error, setError] = useState<Error>()
  const [value, setValue] = useState<T>()


  const execute = useCallback((...params: any[]) => {
    setLoading(true)
    return func(...params).then(data => {
      setValue(data)
      setError(undefined)
      return data
    }).catch(error => {
      setValue(undefined)
      setError(error)
      return Promise.reject(error)
    }).finally(() => {
      setLoading(false)
    })
  }, dependencis)

  return { loading, error, value, execute }
}