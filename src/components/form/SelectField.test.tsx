import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import SelectField, { SelectOption } from './SelectField';

// Wrapper แบบเดียวกับ InputField เพื่อจำลอง Form แม่
const FormWrapper = ({ error, options }: { error?: any, options?: SelectOption[] }) => {
  const { register , setValue} = useForm();
  
  // ตัวเลือกจำลองสำหรับทดสอบ
  const defaultOptions = options || [
    { value: 'male', label: 'ชาย' },
    { value: 'female', label: 'หญิง' },
  ];

  return (
    <form>
      <SelectField
        label="เพศ"
        name="gender"
        options={defaultOptions}
        register={register}
        setValue={setValue}
        error={error}
      />
    </form>
  );
};

describe('SelectField Component', () => {
  it('เรนเดอร์ Label และแสดงตัวเลือกได้อย่างถูกต้อง', async () => {
    const user = userEvent.setup();
    render(<FormWrapper />);
    
    // ตรวจสอบ Label
    expect(screen.getByText('เพศ')).toBeInTheDocument();
    
    // เปิด dropdown
    const triggerButton = screen.getByRole('button', { name: /-- Please select --/ });
    await user.click(triggerButton);
    
    // ตรวจสอบ Options มีอยู่
    expect(screen.getByRole('button', { name: 'ชาย' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'หญิง' })).toBeInTheDocument();
  });

  it('สามารถกดเปลี่ยนตัวเลือก (Select) ได้', async () => {
    const user = userEvent.setup();
    render(<FormWrapper />);
    
    // เปิด dropdown
    const triggerButton = screen.getByRole('button', { name: /-- Please select --/ });
    await user.click(triggerButton);
    
    // เลือกตัวเลือก
    const femaleOption = screen.getByRole('button', { name: 'หญิง' });
    await user.click(femaleOption);
    
    // ตรวจสอบว่าเปลี่ยนเป็น 'หญิง'
    expect(screen.getByRole('button', { name: /หญิง/ })).toBeInTheDocument();
  });

  it('ทำการเลือกอัตโนมัติหากมีเพียง 1 ตัวเลือก (Auto-select)', () => {
    // ส่งตัวเลือกเข้าไปแค่อันเดียว
    const singleOption = [{ value: 'thai', label: 'ไทย' }];
    render(<FormWrapper options={singleOption} />);
    
    // ระบบต้องแสดง 'ไทย' ให้อัตโนมัติ 
    expect(screen.getByRole('button', { name: /ไทย/ })).toBeInTheDocument();
    expect(screen.queryByText('-- Please select --')).not.toBeInTheDocument();
  });

  it('แสดงข้อความ Error และเปลี่ยนสีกรอบเป็นสีแดง', () => {
    const mockError = { type: 'manual', message: 'กรุณาระบุเพศ' };
    render(<FormWrapper error={mockError} />);
    
    // ตรวจสอบข้อความและการเปลี่ยนสีของ CSS
    expect(screen.getByText('กรุณาระบุเพศ')).toHaveClass('text-red-500');
    expect(screen.getByRole('button', { name: /-- Please select --/ })).toHaveClass('border-red-500');
  });
});