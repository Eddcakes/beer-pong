import { Children, isValidElement, cloneElement } from 'react';

/* 
  todo
  style tabs

  finish implementation
  tab to next tab
  allow a tab to be disabled

  https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role
*/

export function Tabs({ value, onChange, title, children }) {
  const tabs = Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return null;
    }
    return cloneElement(child, { onChange, value });
  });
  return (
    <div role='tablist' className='flex justify-between'>
      <div>{tabs}</div>
      {title && <TabsTitle name={title} />}
    </div>
  );
}

function TabsTitle({ name }) {
  return (
    <div className='font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200'>
      {name}
    </div>
  );
}

export function Tab({ value, label, tabId, panelId, onChange }) {
  const active = value === tabId;
  return (
    <button
      role='tab'
      aria-selected={active}
      aria-controls={panelId}
      id={tabId}
      tabIndex={active ? 0 : -1}
      onClick={(evt) => onChange(evt, tabId)}
      className={`p-2 font-bold text-xl uppercase hover:text-primary border-b-4 ${
        active ? 'text-primary border-solid border-primary' : 'border-opacity-0'
      }`}
    >
      {label}
    </button>
  );
}

export function TabContent({ value, tabId, panelId, children }) {
  const active = value === tabId;
  return (
    <div
      id={panelId}
      role='tabpanel'
      tabIndex={0}
      aria-labelledby={tabId}
      className={``}
      hidden={!active}
    >
      {children}
    </div>
  );
}
