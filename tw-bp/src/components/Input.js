/*
input should have
label
input
error msg
*/
/* spreading extra input props allows optional use of aria properties*/
export function Input({
  name,
  type = 'text',
  label = '',
  placeholder = '',
  required = false,
  value,
  onChange,
  helpText = '',
  errorMsg = '',
  ...inputProps
}) {
  return (
    <div className='flex flex-col mb-2'>
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        className={`
        w-full block
        appearance-none
        bg-gray-200 border
        border-gray-200
        text-gray-700
        py-3
        px-4
        pr-8
        rounded
        leading-tight
        focus:outline-none
        focus:bg-white
        focus:border-gray-500`}
        value={value}
        onChange={onChange}
        required={required}
        type={type}
        {...inputProps}
      />
      {helpText.length > 0 ? (
        <small id={name + 'Help'}>{helpText}</small>
      ) : null}
      {errorMsg.length > 0 && <p className='text-red-700'>{errorMsg}</p>}
    </div>
  );
}
