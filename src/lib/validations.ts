import { z } from 'zod';

// กำหนดเงื่อนไขการตรวจสอบข้อมูลของฟอร์มผู้ป่วย
export const patientFormSchema = z.object({
  firstName: z.string().min(1, 'กรุณากรอกชื่อจริง'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
  dateOfBirth: z.string().min(1, 'กรุณาระบุวันเกิด'),
  gender: z.string().min(1, 'กรุณาระบุเพศ'),
  
  // ตรวจสอบเบอร์โทร: ต้องเป็นตัวเลข 9-10 หลัก
  phoneNumber: z.string().regex(/^[0-9]{9,10}$/, 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 9-10 หลัก)'),
  
  // อีเมล: ต้องเป็นรูปแบบอีเมลที่ถูกต้อง (ถ้ามีการกรอก)
  // ใช้ .optional().or(z.literal('')) เพื่ออนุญาตให้เป็นค่าว่างได้ แต่ถ้าพิมพ์ต้องเป็นอีเมล
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง').optional().or(z.literal('')),
  
  address: z.string().min(1, 'กรุณากรอกที่อยู่'),
  preferredLanguage: z.string().min(1, 'กรุณาระบุภาษาที่ถนัด'),
  nationality: z.string().min(1, 'กรุณาระบุสัญชาติ'),
  
  // ข้อมูลติดต่อฉุกเฉินและศาสนาเป็นตัวเลือก (Optional)
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  religion: z.string().optional(),
});

// ดึง Type ออกมาจาก Schema อัตโนมัติ เพื่อนำไปใช้กับ React Hook Form
export type PatientFormData = z.infer<typeof patientFormSchema>;