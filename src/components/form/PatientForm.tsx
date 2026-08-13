"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema, PatientFormData } from "@/lib/validations";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { useFormSync } from "@/hooks/useFormSync"; // Custom Hook สำหรับซิงก์ข้อมูลฟอร์มแบบ Real-time

const PatientForm: React.FC = () => {
  // ผูก Zod Schema เข้ากับ React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch, // ดักจับค่าที่เปลี่ยนแปลง Real-time
    formState: { errors, isSubmitSuccessful },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    mode: "onChange", // ตรวจสอบ Validation ทันทีที่มีการพิมพ์หรือเปลี่ยนค่า
  });

  // ให้ฟอร์มจับตาดู (Watch) ข้อมูลทั้งหมดแบบ Real-time
  const formData = watch();

  // 1. เริ่มต้นด้วยค่าว่าง
  const [sessionId, setSessionId] = useState<string>("");

  // 2. ให้ทำการสุ่ม ID ฝั่ง Client เท่านั้น
  useEffect(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      setSessionId(crypto.randomUUID());
    } else {
      setSessionId(
        `session-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      );
    }
  }, []);

  // นำข้อมูลที่จับตาดูอยู่ ส่งเข้าไปให้ Hook จัดการยิง API
  const syncStatus = useFormSync(sessionId, formData, isSubmitSuccessful);

  // ฟังก์ชันจัดการเมื่อกด Submit
  const onSubmit = (data: PatientFormData) => {
    alert("ส่งข้อมูลสำเร็จ! เจ้าหน้าที่ได้รับข้อมูลของคุณเรียบร้อยแล้ว");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      {/* ส่วนหัวของฟอร์ม (แก้ไขเพิ่ม Status Badge สำหรับ UX) */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 border-b pb-4 gap-2">
        <h2 className="text-2xl font-bold text-gray-800">
          ข้อมูลผู้ป่วย (Patient Information)
        </h2>

        {/* ป้ายกำกับสถานะ (Status Badge) ให้ผู้ป่วยและเราเห็นว่าระบบ Real-time กำลังทำงาน */}
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
          <span className="text-sm font-medium text-gray-500">สถานะ:</span>
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
              syncStatus === "submitted"
                ? "bg-green-100 text-green-700"
                : syncStatus === "actively filling in"
                  ? "bg-blue-100 text-blue-700 animate-pulse"
                  : "bg-gray-200 text-gray-600"
            }`}
          >
            {syncStatus === "submitted"
              ? "ส่งข้อมูลแล้ว"
              : syncStatus === "actively filling in"
                ? "กำลังพิมพ์..."
                : "พักหน้าจอ"}
          </span>
        </div>
      </div>

      {/* กล่องรับข้อมูล (โครงสร้างเดิม) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
        <InputField
          label="ชื่อจริง *"
          name="firstName"
          register={register}
          error={errors.firstName}
          placeholder="ระบุชื่อจริง"
        />
        <InputField
          label="ชื่อกลาง (ทางเลือก)"
          name="middleName"
          register={register}
          error={errors.middleName}
        />
        <InputField
          label="นามสกุล *"
          name="lastName"
          register={register}
          error={errors.lastName}
          placeholder="ระบุนามสกุล"
        />
        <InputField
          label="วันเกิด *"
          name="dateOfBirth"
          type="date"
          register={register}
          error={errors.dateOfBirth}
        />

        <SelectField
          label="เพศ *"
          name="gender"
          setValue={setValue}
          register={register}
          error={errors.gender}
          options={[
            { value: "male", label: "ชาย" },
            { value: "female", label: "หญิง" },
            { value: "other", label: "อื่นๆ" },
          ]}
        />

        <InputField
          label="เบอร์โทรศัพท์ *"
          name="phoneNumber"
          type="tel"
          register={register}
          error={errors.phoneNumber}
          placeholder="08XXXXXXXX"
        />
        <InputField
          label="อีเมล (ทางเลือก)"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          placeholder="example@email.com"
        />

        <div className="md:col-span-2">
          <InputField
            label="ที่อยู่ *"
            name="address"
            register={register}
            error={errors.address}
            placeholder="บ้านเลขที่, ถนน, ซอย, จังหวัด..."
          />
        </div>

        <SelectField
          label="ภาษาที่ถนัด *"
          name="preferredLanguage"
          setValue={setValue}
          register={register}
          error={errors.preferredLanguage}
          options={[
            { value: "thai", label: "ไทย" },
            { value: "english", label: "อังกฤษ" },
            { value: "other", label: "อื่นๆ" },
          ]}
        />
        <InputField
          label="สัญชาติ *"
          name="nationality"
          register={register}
          error={errors.nationality}
          placeholder="เช่น ไทย"
        />
        <InputField
          label="ชื่อผู้ติดต่อฉุกเฉิน (ทางเลือก)"
          name="emergencyContactName"
          register={register}
          error={errors.emergencyContactName}
        />
        <InputField
          label="ความสัมพันธ์ผู้ติดต่อ (ทางเลือก)"
          name="emergencyContactRelationship"
          register={register}
          error={errors.emergencyContactRelationship}
        />
        <InputField
          label="ศาสนา (ทางเลือก)"
          name="religion"
          register={register}
          error={errors.religion}
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitSuccessful}
          className={`px-6 py-2 font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
            isSubmitSuccessful
              ? "bg-gray-400 text-gray-200 cursor-not-allowed" // เปลี่ยนปุ่มเป็นสีเทาเมื่อส่งสำเร็จ
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
          }`}
        >
          {isSubmitSuccessful ? "ส่งข้อมูลสำเร็จ" : "ส่งข้อมูล"}
        </button>
      </div>
    </form>
  );
};

export default PatientForm;
