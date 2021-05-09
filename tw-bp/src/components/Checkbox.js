export function Checkbox({ label, name, checked, handleChange }) {
  return (
    <div>
      <label htmlFor={name} className='pr-3'>
        {label}
      </label>
      <input
        name={name}
        id={name}
        type='checkbox'
        onChange={handleChange}
        checked={checked}
        className='form-checkbox h-5 w-5'
      />
    </div>
  );
}
