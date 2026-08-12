"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema, PatientFormData } from "@/lib/validations";
import InputField from "@/components/form/InputField";
import SelectField from "@/components/form/SelectField";

export default function TestFormPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
  });

  console.log("current errors:", errors);

  const onSubmit = (data: PatientFormData) => {
    console.log("ข้อมูลที่ได้:", data);
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
        label="นามสกุล"
        name="lastName"
        register={register}
        error={errors.lastName}
      />
      <InputField
        label="วันเกิด"
        name="dateOfBirth"
        type="date"
        register={register}
        error={errors.dateOfBirth}
      />
      <InputField
        label="ที่อยู่"
        name="address"
        register={register}
        error={errors.address}
      />
      <InputField
        label="ภาษาที่ถนัด"
        name="preferredLanguage"
        register={register}
        error={errors.preferredLanguage}
      />
      <InputField
        label="สัญชาติ"
        name="nationality"
        register={register}
        error={errors.nationality}
      />
      <InputField
        label="เบอร์โทรศัพท์"
        name="phoneNumber"
        register={register}
        error={errors.phoneNumber}
      />
      <SelectField
        label="เพศ"
        name="gender"
        register={register}
        setValue={setValue}
        error={errors.gender}
        options={[
          { value: "M", label: "ชาย" },
          { value: "F", label: "หญิง" },
          { value: "Other", label: "อื่นๆ" },
        ]}
      />
      {/* ทดสอบ auto-select เมื่อมีตัวเลือกเดียว */}
      <SelectField
        label="ประเภทผู้ป่วย (ทดสอบ single option)"
        name="patientType"
        register={register}
        setValue={setValue}
        options={[{ value: "general", label: "ผู้ป่วยทั่วไป" }]}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        ส่ง
      </button>
    </form>
  );
}
