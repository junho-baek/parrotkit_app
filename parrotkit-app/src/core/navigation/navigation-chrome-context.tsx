import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type NavigationChromeContextValue = {
  homeQuickShootChromeHidden: boolean;
  setHomeQuickShootChromeHidden: (hidden: boolean) => void;
};

const noop = () => {};

const NavigationChromeContext = createContext<NavigationChromeContextValue>({
  homeQuickShootChromeHidden: false,
  setHomeQuickShootChromeHidden: noop,
});

export function NavigationChromeProvider({ children }: { children: ReactNode }) {
  const [homeQuickShootChromeHidden, setHomeQuickShootChromeHiddenState] = useState(false);

  const setHomeQuickShootChromeHidden = useCallback((hidden: boolean) => {
    setHomeQuickShootChromeHiddenState((current) => (current === hidden ? current : hidden));
  }, []);

  const value = useMemo(
    () => ({
      homeQuickShootChromeHidden,
      setHomeQuickShootChromeHidden,
    }),
    [homeQuickShootChromeHidden, setHomeQuickShootChromeHidden]
  );

  return (
    <NavigationChromeContext.Provider value={value}>
      {children}
    </NavigationChromeContext.Provider>
  );
}

export function useNavigationChrome() {
  return useContext(NavigationChromeContext);
}
