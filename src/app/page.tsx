'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientFormSchema, PatientFormData } from '@/lib/validations';
import InputField from '@/components/form/InputField';

export default function TestFormPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
  });

  const onSubmit = (data: PatientFormData) => {
    console.log('ข้อมูลที่ได้:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 max-w-md">
      <InputField
        label="ชื่อจริง"
        name="firstName"
        register={register}
        error={errors.firstName}
      />
      <InputField
        label="เบอร์โทรศัพท์"
        name="phoneNumber"
        register={register}
        error={errors.phoneNumber}
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        ส่ง
      </button>
    </form>
  );
}