import { useState } from 'react';
import { Eye, EyeOff } from '../../icons';

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
        <div
          className='
          inline-flex 
          w-full 
          bg-input-background
          border
        border-gray-200
        text-gray-700
          rounded
          leading-tight
          focus-within:bg-white
          focus-within:border-gray-500'
        >
          <div className='w-full rounded leading-tight py-3 pl-4 focus-within:ring-2 ring-slate-700'>
            <input
              name={name}
              className='outline-none bg-inherit w-full'
              value={value}
              onChange={onChange}
              required={required}
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              {...inputProps}
            />
          </div>
          <span
            className='flex items-center px-2'
            onClick={handleShowPassword}
            role='button'
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </span>
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
