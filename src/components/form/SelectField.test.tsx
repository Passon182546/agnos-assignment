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
  it('เรนเดอร์ Label และ Options แบบหลายตัวเลือกได้อย่างถูกต้อง', () => {
    render(<FormWrapper />);
    
    // ตรวจสอบ Label
    expect(screen.getByText('เพศ')).toBeInTheDocument();
    
    // ตรวจสอบ Options
    expect(screen.getByRole('option', { name: '-- กรุณาเลือก --' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'ชาย' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'หญิง' })).toBeInTheDocument();
  });

  it('สามารถกดเปลี่ยนตัวเลือก (Select) ได้', async () => {
    const user = userEvent.setup();
    render(<FormWrapper />);
    
    const selectElement = screen.getByLabelText('เพศ');
    
    // จำลองการกดเลือกเพศหญิง
    await user.selectOptions(selectElement, 'female');
    
    // ตรวจสอบว่าค่าของ Select เปลี่ยนแปลงอย่างถูกต้อง
    expect(selectElement).toHaveValue('female');
  });

  it('ทำการเลือกอัตโนมัติหากมีเพียง 1 ตัวเลือก (Auto-select)', () => {
    // ส่งตัวเลือกเข้าไปแค่อันเดียว
    const singleOption = [{ value: 'thai', label: 'ไทย' }];
    render(<FormWrapper options={singleOption} />);
    
    const selectElement = screen.getByLabelText('เพศ');
    
    // ระบบต้องเลือก 'thai' ให้อัตโนมัติ และไม่มี Placeholder 
    expect(selectElement).toHaveValue('thai');
    expect(screen.queryByText('-- กรุณาเลือก --')).not.toBeInTheDocument();
  });

  it('แสดงข้อความ Error และเปลี่ยนสีกรอบเป็นสีแดง', () => {
    const mockError = { type: 'manual', message: 'กรุณาระบุเพศ' };
    render(<FormWrapper error={mockError} />);
    
    // ตรวจสอบข้อความและการเปลี่ยนสีของ CSS
    expect(screen.getByText('กรุณาระบุเพศ')).toHaveClass('text-red-500');
    expect(screen.getByLabelText('เพศ')).toHaveClass('border-red-500');
  });
});