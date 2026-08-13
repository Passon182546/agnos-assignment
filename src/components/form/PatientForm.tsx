'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientFormSchema, PatientFormData } from '@/lib/validations';
import InputField from './InputField';
import SelectField from './SelectField';

const PatientForm: React.FC = () => {
  // ผูก Zod Schema เข้ากับ React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    mode: 'onChange', // ตรวจสอบ Validation ทันทีที่มีการพิมพ์หรือเปลี่ยนค่า
  });

  // ฟังก์ชันจัดการเมื่อกด Submit 
  const onSubmit = (data: PatientFormData) => {
    console.log('Form Submitted:', data);
    alert('ตรวจสอบข้อมูลถูกต้อง (เดี๋ยวเราจะเชื่อมระบบ Real-time ในภายหลัง)');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">ข้อมูลผู้ป่วย (Patient Information)</h2>
      
      {/* จัด Layout แบบ Grid: มือถือ 1 คอลัมน์, จอใหญ่ 2 คอลัมน์ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
        <InputField label="ชื่อจริง *" name="firstName" register={register} error={errors.firstName} placeholder="ระบุชื่อจริง" />
        <InputField label="ชื่อกลาง (ทางเลือก)" name="middleName" register={register} error={errors.middleName} />
        <InputField label="นามสกุล *" name="lastName" register={register} error={errors.lastName} placeholder="ระบุนามสกุล" />
        
        <InputField label="วันเกิด *" name="dateOfBirth" type="date" register={register} error={errors.dateOfBirth} />
        
        <SelectField 
          label="เพศ *" 
          name="gender" 
          register={register} 
          setValue={setValue}
          error={errors.gender}
          options={[
            { value: 'male', label: 'ชาย' },
            { value: 'female', label: 'หญิง' },
            { value: 'other', label: 'อื่นๆ' }
          ]} 
        />
        
        <InputField label="เบอร์โทรศัพท์ *" name="phoneNumber" type="tel" register={register} error={errors.phoneNumber} placeholder="08XXXXXXXX" />
        <InputField label="อีเมล (ทางเลือก)" name="email" type="email" register={register} error={errors.email} placeholder="example@email.com" />
        
        {/* ที่อยู่ ใช้พื้นที่เต็ม 2 คอลัมน์บนจอใหญ่ */}
        <div className="md:col-span-2">
          <InputField label="ที่อยู่ *" name="address" register={register} error={errors.address} placeholder="บ้านเลขที่, ถนน, ซอย, จังหวัด..." />
        </div>
        
        <SelectField 
          label="ภาษาที่ถนัด *" 
          name="preferredLanguage" 
          register={register} 
          setValue={setValue}
          error={errors.preferredLanguage}
          options={[
            { value: 'thai', label: 'ไทย' },
            { value: 'english', label: 'อังกฤษ' },
            { value: 'other', label: 'อื่นๆ' }
          ]} 
        />
        <InputField label="สัญชาติ *" name="nationality" register={register} error={errors.nationality} placeholder="เช่น ไทย" />
        
        <InputField label="ชื่อผู้ติดต่อฉุกเฉิน (ทางเลือก)" name="emergencyContactName" register={register} error={errors.emergencyContactName} />
        <InputField label="ความสัมพันธ์ผู้ติดต่อ (ทางเลือก)" name="emergencyContactRelationship" register={register} error={errors.emergencyContactRelationship} />
        <InputField label="ศาสนา (ทางเลือก)" name="religion" register={register} error={errors.religion} />
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          type="submit" 
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          ส่งข้อมูล
        </button>
      </div>
    </form>
  );
};

export default PatientForm;