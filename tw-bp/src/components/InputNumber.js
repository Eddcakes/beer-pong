/* support different types of number inputs */
/* to use browser min/max or JOI validation? */
export function InputNumber({
  name,
  min = 0,
  max = 6,
  label = '',
  onChange,
  value,
  required = false,
  helpText = '',
  errorMsg = '',
}) {
  return (
    <div className='flex flex-col mb-2'>
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        className={`
        w-full block
        appearance-none
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
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        required={required}
        type='number'
      />
      {helpText.length > 0 ? (
        <small id={name + 'Help'}>{helpText}</small>
      ) : null}
      {errorMsg.length > 0 && <p className='text-negative'>{errorMsg}</p>}
    </div>
  );
}
