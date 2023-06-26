import { useCallback, useEffect, useState } from "react";

type AsyncFunc<T> = (...params: any[]) => Promise<T>;

interface AsyncState<T> {
  loading: boolean;
  error: any;
  value: T | undefined;
  execute: AsyncFunc<T>;
}

export function useAsync<T>(
  func: AsyncFunc<T>,
  dependencies: any[] = []
): AsyncState<T> {
  const { execute, ...state } = useAsyncInternal<T>(func, dependencies, true);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, execute };
}

export function useAsyncFn<T>(
  func: AsyncFunc<T>,
  dependencies: any[] = []
): AsyncState<T> {
  return useAsyncInternal<T>(func, dependencies, false);
}

function useAsyncInternal<T>(
  func: AsyncFunc<T>,
  dependencies: any[],
  initialLoading = false
): AsyncState<T> {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<any>();
  const [value, setValue] = useState<T | undefined>();

  const execute = useCallback(
    (...params: any[]): Promise<T> => {
      setLoading(true);
      return func(...params)
        .then((data: T) => {
          setValue(data);
          setError(undefined);
          return data;
        })
        .catch((error: any) => {
          setError(error);
          setValue(undefined);
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }, dependencies);

  return { loading, error, value, execute };
}
