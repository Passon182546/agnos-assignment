import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import InputField from './InputField';

// 1. สร้าง Wrapper Component เพื่อจำลองการทำงานของ React Hook Form
const FormWrapper = ({ error }: { error?: any }) => {
  const { register } = useForm();
  return (
    <form>
      <InputField
        label="ชื่อจริง"
        name="firstName"
        register={register}
        error={error}
        placeholder="กรอกชื่อจริง"
      />
    </form>
  );
};

describe('InputField Component', () => {
  it('เรนเดอร์ Label และ Input ได้อย่างถูกต้อง', () => {
    render(<FormWrapper />);
    
    // ค้นหา Label ว่ามีข้อความ "ชื่อจริง" หรือไม่
    const labelElement = screen.getByText('ชื่อจริง');
    expect(labelElement).toBeInTheDocument();

    // ค้นหา Input ผ่าน Placeholder
    const inputElement = screen.getByPlaceholderText('กรอกชื่อจริง');
    expect(inputElement).toBeInTheDocument();
  });

  it('สามารถพิมพ์ข้อความลงในช่องกรอกได้', async () => {
    // จำลองพฤติกรรมผู้ใช้ (User) ด้วย userEvent
    const user = userEvent.setup();
    render(<FormWrapper />);
    
    // ค้นหา Input ผ่าน Label (เป็นการทดสอบว่า htmlFor กับ id ผูกกันถูกต้อง)
    const inputElement = screen.getByLabelText('ชื่อจริง');
    
    // จำลองการพิมพ์คำว่า "พัสสน" ลงในช่องกรอก
    await user.type(inputElement, 'พัสสน');
    
    // ตรวจสอบว่าค่าในช่องกรอกเปลี่ยนเป็น "พัสสน" จริง
    expect(inputElement).toHaveValue('พัสสน');
  });

  it('แสดงข้อความ Error และเปลี่ยนสีกรอบเป็นสีแดงเมื่อเกิดข้อผิดพลาด', () => {
    // จำลอง Error Object ที่จะได้จาก React Hook Form
    const mockError = {
      type: 'manual',
      message: 'กรุณากรอกชื่อจริง',
    };

    render(<FormWrapper error={mockError} />);
    
    // ตรวจสอบว่ามีข้อความ Error โผล่ขึ้นมาบนหน้าจอ
    const errorMessage = screen.getByText('กรุณากรอกชื่อจริง');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-500');

    // ตรวจสอบว่ากรอบของ Input เปลี่ยนเป็นสีแดง
    const inputElement = screen.getByLabelText('ชื่อจริง');
    expect(inputElement).toHaveClass('border-red-500');
  });
});