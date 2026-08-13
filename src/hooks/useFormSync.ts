import { useEffect, useRef, useState } from 'react';

export type FormStatus = 'actively filling in' | 'inactive' | 'submitted';

export const useFormSync = (sessionId: string, formData: any, isSubmitted: boolean) => {
  const [status, setStatus] = useState<FormStatus>('inactive');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inactiveTimeout = useRef<NodeJS.Timeout | null>(null);
  const isFirstRun = useRef(true); // ป้องกันการยิงสถานะทันทีตอน mount ที่ฟอร์มยังว่างอยู่

  const syncData = async (currentStatus: FormStatus, data: any) => {
    // ถ้ายังไม่มี sessionId (ตอนเพิ่งเรนเดอร์ครั้งแรก) ให้ข้ามไปก่อน
    if (!sessionId) return; 

    try {
      await fetch('/api/pusher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId, // <-- แนบ ID ไปด้วย
          status: currentStatus,
          formData: data,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error syncing form data:', error);
    }
  };

  // สร้าง key เป็น string เพื่อเทียบ "ค่า" แทน "reference" ของ object
  const formDataKey = JSON.stringify(formData);

  useEffect(() => {
    if (isSubmitted) {
      setStatus('submitted');
      syncData('submitted', formData);
      return;
    }

    // ข้ามการยิงสถานะตอน mount ครั้งแรก เพราะฟอร์มยังว่างเปล่า ผู้ป่วยยังไม่ได้ทำอะไร
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    setStatus('actively filling in');

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (inactiveTimeout.current) clearTimeout(inactiveTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      syncData('actively filling in', formData);
    }, 500);

    inactiveTimeout.current = setTimeout(() => {
      setStatus('inactive');
      syncData('inactive', formData);
    }, 3000);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      if (inactiveTimeout.current) clearTimeout(inactiveTimeout.current);
    };
  }, [formDataKey, isSubmitted, sessionId]); // ใช้ formDataKey (string) แทน formData (object)

  return status;
};