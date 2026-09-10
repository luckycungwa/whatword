'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== prevPath) {
      setPrevPath(pathname);
    }
  }, [pathname, prevPath]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handleStart = () => {
      setVisible(true);
    };
    const handleComplete = () => {
      timer = setTimeout(() => setVisible(false), 200);
    };

    window.addEventListener('beforeunload', handleStart);
    return () => {
      window.removeEventListener('beforeunload', handleStart);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (pathname !== prevPath) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [pathname, prevPath]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px]">
      <div className="h-full animate-nav-progress bg-[#0066ff]" />
      <style>{`
        @keyframes nav-progress {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 100%; margin-left: 0%; }
        }
        .animate-nav-progress {
          animation: nav-progress 600ms ease-out forwards;
        }
      `}</style>
    </div>
  );
}
