'use client';

import React, { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusherClient';
import { FormStatus } from '@/hooks/useFormSync';
import { PatientFormData } from '@/lib/validations';

// กำหนดโครงสร้างข้อมูลที่ส่งมาจาก API
interface SyncPayload {
  sessionId: string;
  status: FormStatus;
  formData: PatientFormData;
  timestamp: string;
}

const StaffDashboard: React.FC = () => {
  // ใช้ Record (คล้ายๆ Dictionary/Object) ในการเก็บข้อมูลผู้ป่วย โดยมี sessionId เป็น Key
  const [patientsData, setPatientsData] = useState<Record<string, SyncPayload>>({});

  useEffect(() => {
    // 1. กดติดตาม (Subscribe) ช่องทางสื่อสาร
    const channel = pusherClient.subscribe('patient-channel');

    // 2. ดักฟัง Event ชื่อ 'form-update' (ต้องชื่อตรงกับที่ส่งจาก API route.ts)
    channel.bind('form-update', (incomingData: SyncPayload) => {
      
      // 3. อัปเดต State โดยใช้ sessionId เป็นกุญแจในการแยกผู้ป่วย
      setPatientsData((prevData) => ({
        ...prevData,
        [incomingData.sessionId]: incomingData, // ถ้า ID ซ้ำจะทับของเดิม, ถ้า ID ใหม่จะสร้างกล่องใหม่
      }));
    });

    // 4. Cleanup function ป้องกันปัญหา Memory Leak หรือการกดติดตามซ้ำซ้อน
    return () => {
      channel.unbind('form-update');
      pusherClient.unsubscribe('patient-channel');
    };
  }, []);

  // แปลง Object ให้กลายเป็น Array เพื่อนำไปวนลูปแสดงผล (เรียงจากเวลาล่าสุดขึ้นก่อน)
  const patientList = Object.values(patientsData).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">แดชบอร์ดเจ้าหน้าที่ (Staff Dashboard)</h2>
      
      {patientList.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg text-gray-500">
          กำลังรอข้อมูลจากผู้ป่วย...
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
  
  // กำหนดสีและข้อความของป้ายสถานะ (Badge)
  const statusConfig = {
    'actively filling in': { color: 'bg-blue-100 text-blue-700 border-blue-200', text: 'กำลังพิมพ์...' },
    'inactive': { color: 'bg-gray-100 text-gray-700 border-gray-200', text: 'พักหน้าจอ' },
    'submitted': { color: 'bg-green-100 text-green-700 border-green-200', text: 'ส่งข้อมูลแล้ว' },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm border-2 transition-colors ${
      status === 'submitted' ? 'border-green-400' : 
      status === 'actively filling in' ? 'border-blue-400' : 'border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-3 border-b pb-2">
        <div>
          <h3 className="font-bold text-lg text-gray-800 truncate">
            {formData.firstName || formData.lastName ? 
              `${formData.firstName || ''} ${formData.lastName || ''}` : 
              'ผู้ป่วยนิรนาม'}
          </h3>
          <p className="text-xs text-gray-400">
            อัปเดต: {new Date(timestamp).toLocaleTimeString('th-TH')}
          </p>
        </div>
        
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${currentStatus.color}`}>
          {currentStatus.text}
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-600">
        <p><span className="font-medium">เพศ:</span> {formData.gender || '-'}</p>
        <p><span className="font-medium">เบอร์โทร:</span> {formData.phoneNumber || '-'}</p>
        <p className="truncate"><span className="font-medium">ที่อยู่:</span> {formData.address || '-'}</p>
        {/* เราสามารถเลือกแสดงข้อมูลสำคัญๆ ไว้ที่หน้าการ์ดได้ตามต้องการ */}
      </div>
    </div>
  );
};

export default StaffDashboard;