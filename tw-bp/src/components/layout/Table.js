// todo use theme to drive table styles

export function Table({ children }) {
  return (
    <table className='border-collapse table-fixed w-full text-sm'>
      {children}
    </table>
  );
}

export function Tbody({ children }) {
  return <tbody className='bg-white dark:bg-slate-800'>{children}</tbody>;
}

export function Th({ children, hideSmall, ...props }) {
  const extra = hideSmall ? 'hidden md:table-cell' : '';
  return (
    <th
      className={`border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left ${extra}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function Td({ children, hideSmall }) {
  const extra = hideSmall ? 'hidden md:table-cell' : '';
  return (
    <td
      className={`border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 ${extra}`}
    >
      {children}
    </td>
  );
}
