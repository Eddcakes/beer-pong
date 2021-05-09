export function Select({
  name,
  placeholder = 'Select option',
  onChange = () => {},
  children,
  ...rest
}) {
  return (
    <select
      name={name}
      // appearance-none
      className={`
      w-full
      block
      bg-input-background
      border
      border-gray-200
      text-gray-700
      py-3
      px-4
      pr-8
      rounded
      leading-tight
      focus:outline-none
      focus:bg-white
      focus:border-gray-500
      `}
      onChange={onChange}
      {...rest}
    >
      <option value=''>{placeholder}</option>
      {children}
    </select>
  );
}
