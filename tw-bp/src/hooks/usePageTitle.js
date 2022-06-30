import { useEffect } from 'react';

export function usePageTitle(newPageTitle = 'Pongleby') {
  useEffect(() => {
    document.title = newPageTitle;
  }, [newPageTitle]);
}
