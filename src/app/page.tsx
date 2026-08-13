import PatientForm from '@/components/form/PatientForm';
import StaffDashboard from '@/components/staff/StaffDashboard';

export default function Home() {
  return (
    // เปลี่ยนพื้นหลังให้สว่างและคลีนขึ้น (bg-slate-50)
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center">
          <div className="h-12 w-12 bg-[#EAF2FF] text-[#1A59C2] rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Patient Registration System</h1>
          <p className="mt-2 text-slate-500 font-medium">Real-time Data Synchronization System</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          {/* Patient view */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-[#1A59C2] px-6 py-4">
              <span className="font-bold text-white flex items-center gap-2">
                Patient View
              </span>
            </div>
            <div className="p-6">
              <PatientForm />
            </div>
          </div>

          {/* Staff view */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
            <div className="bg-[#1A59C2] px-6 py-4">
              <span className="font-bold text-white flex items-center gap-2">
                Staff View
              </span>
            </div>
            <div className="p-6 bg-slate-50/50 min-h-[500px]">
              <StaffDashboard />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}