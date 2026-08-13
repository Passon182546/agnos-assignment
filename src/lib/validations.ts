import { z } from 'zod';

// กำหนดเงื่อนไขการตรวจสอบข้อมูลของฟอร์มผู้ป่วย
export const patientFormSchema = z.object({
  firstName: z.string().min(1, 'Please enter your first name'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Please enter your last name'),
  dateOfBirth: z.string().min(1, 'Please select your date of birth'),
  gender: z.string().min(1, 'Please select your gender'),
  
  // Validate phone number: 9-10 digits only
  phoneNumber: z.string().regex(/^[0-9]{9,10}$/, 'Phone number format is invalid (must be 9-10 digits)'),
  
  // Email is optional but must be valid if provided
  email: z.string().email('Email format is invalid').optional().or(z.literal('')),
  
  address: z.string().min(1, 'Please enter your address'),
  preferredLanguage: z.string().min(1, 'Please select your preferred language'),
  nationality: z.string().min(1, 'Please enter your nationality'),
  
  // ข้อมูลติดต่อฉุกเฉินและศาสนาเป็นตัวเลือก (Optional)
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  religion: z.string().optional(),
});

// ดึง Type ออกมาจาก Schema อัตโนมัติ เพื่อนำไปใช้กับ React Hook Form
export type PatientFormData = z.infer<typeof patientFormSchema>;