"use client";

import React, { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusherClient";
import { FormStatus } from "@/hooks/useFormSync";
import { PatientFormData } from "@/lib/validations";

// กำหนดโครงสร้างข้อมูลที่ส่งมาจาก API
interface SyncPayload {
  sessionId: string;
  status: FormStatus;
  formData: PatientFormData;
  timestamp: string;
}

const StaffDashboard: React.FC = () => {
  // ใช้ Record (คล้ายๆ Dictionary/Object) ในการเก็บข้อมูลผู้ป่วย โดยมี sessionId เป็น Key
  const [patientsData, setPatientsData] = useState<Record<string, SyncPayload>>(
    {},
  );

  useEffect(() => {
    // 1. กดติดตาม (Subscribe) ช่องทางสื่อสาร
    const channel = pusherClient.subscribe("patient-channel");

    // 2. ดักฟัง Event ชื่อ 'form-update' (ต้องชื่อตรงกับที่ส่งจาก API route.ts)
    channel.bind("form-update", (incomingData: SyncPayload) => {
      // 3. อัปเดต State โดยใช้ sessionId เป็นกุญแจในการแยกผู้ป่วย
      setPatientsData((prevData) => ({
        ...prevData,
        [incomingData.sessionId]: incomingData, // ถ้า ID ซ้ำจะทับของเดิม, ถ้า ID ใหม่จะสร้างกล่องใหม่
      }));
    });

    // 4. Cleanup function ป้องกันปัญหา Memory Leak หรือการกดติดตามซ้ำซ้อน
    return () => {
      channel.unbind("form-update");
      pusherClient.unsubscribe("patient-channel");
    };
  }, []);

  // แปลง Object ให้กลายเป็น Array เพื่อนำไปวนลูปแสดงผล (เรียงจากเวลาล่าสุดขึ้นก่อน)
  const patientList = Object.values(patientsData).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Staff Dashboard</h2>

      {patientList.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg text-gray-500">
          Waiting for patient data...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {patientList.map((patient) => (
            <PatientCard key={patient.sessionId} patient={patient} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Component ย่อยสำหรับแสดงการ์ดของผู้ป่วยแต่ละคน ---
const PatientCard = ({ patient }: { patient: SyncPayload }) => {
  const { status, formData, timestamp } = patient;

  const statusConfig = {
    "actively filling in": {
      border: "border-l-[#1A59C2]",
      badge: "bg-[#EAF2FF] text-[#1A59C2] border-[#BFD4F8]",
      text: "Filling in...",
    },
    inactive: {
      border: "border-l-slate-300",
      badge: "bg-slate-50 text-slate-600 border-slate-200",
      text: "Idle",
    },
    submitted: {
      border: "border-l-[#1A59C2]",
      badge: "bg-[#EAF2FF] text-[#1A59C2] border-[#BFD4F8]",
      text: "Submitted",
    },
  };

  const currentStatus = statusConfig[status];

  return (
    // เพิ่ม border-l-4 เพื่อสร้างแถบสีด้านซ้ายของการ์ด
    <div
      className={`p-5 bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 ${currentStatus.border} transition-all hover:shadow-md min-h-[190px] flex flex-col`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-lg text-slate-800 truncate">
            {formData.firstName || formData.lastName
              ? `${formData.firstName || ""} ${formData.lastName || ""}`
              : "New patient"}
          </h3>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            {new Date(timestamp).toLocaleTimeString("th-TH")}
          </p>
        </div>

        <span
          className={`px-2.5 py-1 rounded-md text-xs font-bold border shrink-0 ${currentStatus.badge}`}
        >
          {currentStatus.text}
        </span>
      </div>

      <div className="space-y-2.5 text-sm flex-1">
        <p className="flex gap-2 justify-between items-center">
          <span className="text-slate-500 font-medium">Gender:</span>
          <span className="font-semibold text-slate-900">
            {formData.gender === "male"
              ? "Male"
              : formData.gender === "female"
                ? "Female"
                : formData.gender === "other"
                  ? "Other"
                  : "-"}
          </span>
        </p>
        <p className="flex gap-2 justify-between items-center">
          <span className="text-slate-500 font-medium">Phone:</span>
          <span className="font-semibold text-slate-900">
            {formData.phoneNumber || "-"}
          </span>
        </p>
        <p className="flex gap-2 justify-between items-center border-t border-slate-200 pt-2.5 mt-2.5">
          <span className="text-slate-500 font-medium">Nationality:</span>
          <span className="font-semibold text-slate-900">
            {formData.nationality || "-"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default StaffDashboard;
