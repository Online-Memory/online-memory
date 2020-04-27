import { useCallback, useState } from 'react';

const KEY = 'zoomLevel';

export const useZoom = (initialValue: number) => {
  const [tileSize, setTileSize] = useState<number>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(KEY);
      // Parse stored json or if none return initialValue
      return item ? Number(JSON.parse(item)) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: any) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(tileSize) : value;
        // Save state
        setTileSize(valueToStore);
        // Save to local storage
        window.localStorage.setItem(KEY, JSON.stringify(valueToStore));
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    },
    [tileSize]
  );

  const zoomIn = useCallback(() => {
    if (tileSize < 96) {
      return setValue(tileSize + 1);
    }
    return tileSize;
  }, [setValue, tileSize]);

  const zoomOut = useCallback(() => {
    if (tileSize > 40) {
      return setValue(tileSize - 1);
    }
    return tileSize;
  }, [setValue, tileSize]);

  return {
    tileSize,
    zoomIn,
    zoomOut,
  };
};
