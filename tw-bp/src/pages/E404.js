import React, { useEffect } from 'react';

export function E404({ updatePageTitle }) {
  useEffect(() => {
    updatePageTitle('Error 404 page was not found');
  });
  return <div>E404 page not found</div>;
}
