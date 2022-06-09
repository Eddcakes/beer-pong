import { useState } from 'react';
import { Eye, EyeOff } from '../../icons';
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
  const pwField = type === 'password';
  const [showPassword, setShowPassword] = useState(pwField ? false : null);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  if (pwField) {
    return (
      <div className='flex flex-col mb-2'>
        <label htmlFor={name}>
          {label}
          {required && ' *'}
        </label>
        <div className='relative w-full'>
          <span
            className='absolute inset-y-0 right-0 flex items-center px-2'
            onClick={handleShowPassword}
            role='button'
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </span>
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
        pr-10
        rounded
        leading-tight
        focus:bg-white
        focus:border-gray-500`}
            value={value}
            onChange={onChange}
            required={required}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            {...inputProps}
          />
        </div>
        {helpText.length > 0 ? (
          <small id={name + 'Help'}>{helpText}</small>
        ) : null}
        {errorMsg.length > 0 && <p className='text-negative'>{errorMsg}</p>}
      </div>
    );
  }
  return (
    <div className='flex flex-col mb-2'>
      <label htmlFor={name}>
        {label}
        {required && ' *'}
      </label>
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
        focus:bg-white
        focus:border-gray-500`}
        value={value}
        onChange={onChange}
        required={required}
        type={type}
        placeholder={placeholder}
        {...inputProps}
      />
      {helpText.length > 0 ? (
        <small id={name + 'Help'}>{helpText}</small>
      ) : null}
      {errorMsg.length > 0 && <p className='text-negative'>{errorMsg}</p>}
    </div>
  );
}
