import React, { useEffect } from 'react';
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
  // Logic สำหรับ UX: ถ้ามีตัวเลือกแค่ 1 อัน ให้ทำการเลือก (Auto-select) ค่านั้นอัตโนมัติ
  const hasSingleOption = options.length === 1;

  // เพิ่ม useEffect นี้ — sync ค่าเข้า form state จริงๆ ตอน mount หรือเมื่อ options เปลี่ยน
  useEffect(() => {
    if (hasSingleOption) {
      setValue(name, options[0].value, { shouldValidate: true });
    }
  }, [hasSingleOption, options[0]?.value, name, setValue]);
  
  return (
    <div className="flex flex-col gap-1 w-full mb-4">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <select
        id={name}
        className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors sm:text-sm bg-white ${
          error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        }`}
        defaultValue={hasSingleOption ? options[0].value : ""}
        {...rest}
        {...register(name)}
      >
        {/* ถ้ามีหลายตัวเลือก ให้แสดง Placeholder เป็นค่าเริ่มต้น */}
        {!hasSingleOption && (
          <option value="" disabled>
            -- กรุณาเลือก --
          </option>
        )}
        
        {/* วนลูปสร้างตัวเลือก */}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      
      {error && (
        <span className="text-xs text-red-500 mt-1">{error.message}</span>
      )}
    </div>
  );
};

export default SelectField;