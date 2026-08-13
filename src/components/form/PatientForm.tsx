"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema, PatientFormData } from "@/lib/validations";
import InputField from "./InputField";
import SelectField from "./SelectField";
import DatePickerField from "./DatePickerField";
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
    alert("Submission successful! The staff has received your information.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto">
      {/* Form header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 pb-4 border-b border-slate-100 gap-4">
        <h2 className="text-xl font-bold text-slate-800">Patient Information</h2>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Status
          </span>
          <span
            className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors ${
              syncStatus === "submitted"
                ? "bg-[#EAF2FF] text-[#1A59C2]"
                : syncStatus === "actively filling in"
                  ? "bg-[#EAF2FF] text-[#1A59C2] animate-pulse"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {syncStatus === "submitted"
              ? "Submitted"
              : syncStatus === "actively filling in"
                ? "Filling in..."
                : "Waiting"}
          </span>
        </div>
      </div>

      {/* กล่องรับข้อมูล (โครงสร้างเดิม) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
        <InputField
          label="First Name *"
          name="firstName"
          register={register}
          error={errors.firstName}
          placeholder="Enter first name"
        />
        <InputField
          label="Middle Name (optional)"
          name="middleName"
          register={register}
          error={errors.middleName}
        />
        <InputField
          label="Last Name *"
          name="lastName"
          register={register}
          error={errors.lastName}
          placeholder="Enter last name"
        />
        <DatePickerField
          label="Date of Birth *"
          name="dateOfBirth"
          register={register}
          setValue={setValue}
          error={errors.dateOfBirth}
        />

        <SelectField
          label="Gender *"
          name="gender"
          setValue={setValue}
          register={register}
          error={errors.gender}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ]}
        />

        <InputField
          label="Phone Number *"
          name="phoneNumber"
          type="tel"
          register={register}
          error={errors.phoneNumber}
          placeholder="08XXXXXXXX"
        />
        <InputField
          label="Email (optional)"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          placeholder="example@email.com"
        />

        <div className="md:col-span-2">
          <InputField
            label="Address *"
            name="address"
            register={register}
            error={errors.address}
            placeholder="Street, district, city, province..."
          />
        </div>

        <SelectField
          label="Preferred Language *"
          name="preferredLanguage"
          setValue={setValue}
          register={register}
          error={errors.preferredLanguage}
          options={[
            { value: "thai", label: "Thai" },
            { value: "english", label: "English" },
            { value: "other", label: "Other" },
          ]}
        />
        <InputField
          label="Nationality *"
          name="nationality"
          register={register}
          error={errors.nationality}
          placeholder="e.g. Thai"
        />
        <InputField
          label="Emergency Contact Name (optional)"
          name="emergencyContactName"
          register={register}
          error={errors.emergencyContactName}
        />
        <InputField
          label="Relationship (optional)"
          name="emergencyContactRelationship"
          register={register}
          error={errors.emergencyContactRelationship}
        />
        <InputField
          label="Religion (optional)"
          name="religion"
          register={register}
          error={errors.religion}
        />
      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitSuccessful}
          className={`px-8 py-3 font-bold rounded-xl shadow-sm focus:outline-none focus:ring-4 transition-all duration-200 ${
            isSubmitSuccessful
              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              : "bg-[#1A59C2] text-white hover:bg-[#1548a1] hover:shadow-md hover:-translate-y-0.5 focus:ring-[#BFD4F8]"
          }`}
        >
          {isSubmitSuccessful ? "Submitted successfully" : "Submit Information"}
        </button>
      </div>
    </form>
  );
};

export default PatientForm;
