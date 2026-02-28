// File: src/hooks/useNavigation.ts
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PATH_TO_TAB_MAP, TAB_TO_PATH_MAP } from '@/constants';

export function useNavigation(defaultTab: string = 'dashboard') {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    const tab = PATH_TO_TAB_MAP[pathname] || 'dashboard';
    setActiveTab(tab);
  }, [pathname]);

  const navigateToTab = (tabValue: string) => {
    setActiveTab(tabValue);
    const path = TAB_TO_PATH_MAP[tabValue] || '/';
    router.push(path);
  };

  return {
    activeTab,
    setActiveTab,
    navigateToTab,
    pathname,
  };
}
