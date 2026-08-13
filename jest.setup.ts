import '@testing-library/jest-dom';

// 1. Mock global fetch เพื่อไม่ให้เกิด Error "fetch is not defined" เวลา Hook แอบทำงานเบื้องหลัง
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

// 2. Mock crypto สำหรับการสุ่ม UUID ใน PatientForm (ช่วยเก็บตก Coverage บรรทัดที่ 35-36)
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'mock-uuid-1234',
  },
});