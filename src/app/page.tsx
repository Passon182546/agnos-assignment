import PatientForm from '@/components/form/PatientForm';
import StaffDashboard from '@/components/staff/StaffDashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="bg-blue-900 text-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold">ระบบลงทะเบียนผู้ป่วย (Agnos Assignment)</h1>
          <p className="mt-2 text-blue-200">ทดสอบระบบ Real-time Sync (ซ้าย: ฝั่งผู้ป่วย / ขวา: ฝั่งเจ้าหน้าที่)</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          {/* ฝั่งซ้าย: ผู้ป่วย */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-blue-50 px-4 py-2 border-b border-blue-100">
              <span className="font-semibold text-blue-800">📱 มุมมองผู้ป่วย (Patient View)</span>
            </div>
            <div className="p-2">
              <PatientForm />
            </div>
          </div>

          {/* ฝั่งขวา: เจ้าหน้าที่ */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 sticky top-8">
            <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100">
              <span className="font-semibold text-emerald-800">💻 มุมมองเจ้าหน้าที่ (Staff View)</span>
            </div>
            <StaffDashboard />
          </div>
        </div>

      </div>
    </main>
  );
}