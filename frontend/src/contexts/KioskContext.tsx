import React, { createContext, useContext, useEffect, useState } from 'react';

interface KioskContextType {
  isKioskMode: boolean;
}

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export function KioskProvider({ children }: { children: React.ReactNode }) {
  const [isKioskMode, setIsKioskMode] = useState(false);

  useEffect(() => {
    // Check URL parameter for kiosk mode
    const params = new URLSearchParams(window.location.search);
    setIsKioskMode(params.get('kiosk') === '1');
  }, []);

  return (
    <KioskContext.Provider value={{ isKioskMode }}>
      {children}
    </KioskContext.Provider>
  );
}

export function useKiosk() {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  return context;
}
