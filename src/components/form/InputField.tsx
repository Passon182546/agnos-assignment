import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string; 
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  register,
  error,
  type = 'text', 
  ...rest // รับ props อื่น ๆ ของ input
}) => {
  return (
    <div className="flex flex-col gap-1 w-full mb-4">
      <label htmlFor={name} className="text-sm font-medium text-gray-700"> 
        {label}
      </label>
      
      <input
        id={name}
        type={type}
        className={`px-3 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors sm:text-sm ${
          error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-slate-300 focus:ring-[#BFD4F8] focus:border-[#1A59C2]'
        }`}
        {...rest}
        {...register(name)}
      />
      
      {error && (
        <span className="text-xs text-red-500 mt-1">{error.message}</span>
      )}
    </div>
  );
};

export default InputField;