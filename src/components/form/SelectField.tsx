import React, { useEffect, useRef, useState } from 'react';
import { UseFormRegister, UseFormSetValue, FieldError } from 'react-hook-form';

// กำหนดโครงสร้างของตัวเลือกแต่ละข้อ
export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: SelectOption[];
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  error?: FieldError;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  register,
  setValue,
  error,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Logic สำหรับ UX: ถ้ามีตัวเลือกแค่ 1 อัน ให้ทำการเลือก (Auto-select) ค่านั้นอัตโนมัติ
  const hasSingleOption = options.length === 1;

  // เพิ่ม useEffect นี้ — sync ค่าเข้า form state จริงๆ ตอน mount หรือเมื่อ options เปลี่ยน
  useEffect(() => {
    if (hasSingleOption) {
      setSelectedValue(options[0].value);
      setValue(name, options[0].value, { shouldValidate: true });
    }
  }, [hasSingleOption, options[0]?.value, name, setValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectOption = (value: string) => {
    setSelectedValue(value);
    setValue(name, value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === selectedValue)?.label || '-- Please select --';
  
  return (
    <div className="flex flex-col gap-1 w-full mb-4">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input type="hidden" id={name} value={selectedValue} {...register(name)} />

      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2.5 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors sm:text-sm bg-white text-left cursor-pointer ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-300 focus:ring-[#BFD4F8] focus:border-[#1A59C2]'
          }`}
        >
          <span className={selectedValue ? 'text-slate-900' : 'text-slate-500'}>
            {selectedLabel}
          </span>

          <svg
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 8L10 11L13 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
            {!hasSingleOption && (
              <button
                type="button"
                onClick={() => {
                  setSelectedValue('');
                  setValue(name, '', { shouldDirty: true, shouldTouch: true, shouldValidate: true });
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm ${
                  !selectedValue
                    ? 'bg-slate-100 text-slate-500'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                -- Please select --
              </button>
            )}

            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelectOption(opt.value)}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  selectedValue === opt.value
                    ? 'bg-[#1A59C2] text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <span className="text-xs text-red-500 mt-1">{error.message}</span>}
    </div>
  );
};

export default SelectField;