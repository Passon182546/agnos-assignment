import { patientFormSchema } from './validations';

describe('Patient Form Validation Schema', () => {
  it('ควรผ่านการตรวจสอบหากข้อมูลครบถ้วนและถูกต้อง', () => {
    const validData = {
      firstName: 'พัสสน',
      lastName: 'สุดใจ',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      phoneNumber: '0812345678',
      address: '123 ถ.สุขุมวิท กทม.',
      preferredLanguage: 'Thai',
      nationality: 'Thai',
    };

    const result = patientFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('ควรแจ้งเตือนหากเบอร์โทรศัพท์ผิดรูปแบบ', () => {
    const invalidData = {
      firstName: 'สมหมาย',
      lastName: 'ใจดี',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      phoneNumber: '08123', // สั้นเกินไป
      address: '123',
      preferredLanguage: 'Thai',
      nationality: 'Thai',
    };

    const result = patientFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Phone number format is invalid (must be 9-10 digits)');
    }
  });

  it('อีเมลสามารถเว้นว่างได้ แต่ถ้ากรอกต้องถูกรูปแบบ', () => {
    // ทดสอบกรณีเว้นว่าง
    const emptyEmailData = { 
        firstName: 'A', 
        lastName: 'B', 
        dateOfBirth: '2000-01-01', 
        gender: 'M', 
        phoneNumber: '0812345678', 
        address: 'X', 
        preferredLanguage: 'Y', 
        nationality: 'Z', 
        email: '' 
    };
    expect(patientFormSchema.safeParse(emptyEmailData).success).toBe(true);

    // ทดสอบกรณีกรอกผิด
    const invalidEmailData = { ...emptyEmailData, email: 'not-an-email' };
    const result = patientFormSchema.safeParse(invalidEmailData);
    expect(result.success).toBe(false);
  });
});