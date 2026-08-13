import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusherServer';
import { patientFormSchema } from '@/lib/validations';
import { z } from 'zod';

// กำหนด schema สำหรับ payload ทั้งก้อนที่ยิงเข้ามา
const syncPayloadSchema = z.object({
  sessionId: z.string().min(1),
  status: z.enum(['actively filling in', 'inactive', 'submitted']),
  formData: z.any(),
  timestamp: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. เช็ครูปร่างพื้นฐานของ payload ก่อนเลย (กัน request ที่ผิดโครงสร้างสิ้นเชิง)
    const payloadResult = syncPayloadSchema.safeParse(body);
    if (!payloadResult.success) {
      return NextResponse.json(
        { success: false, error: 'รูปแบบข้อมูลไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // 2. ถ้าเป็นสถานะ submitted ต้อง validate formData แบบเข้มงวดเต็มรูปแบบ
    if (body.status === 'submitted') {
      const validationResult = patientFormSchema.safeParse(body.formData);
      if (!validationResult.success) {
        return NextResponse.json(
          { success: false, error: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง' },
          { status: 400 }
        );
      }
    } else {
      // 3. สถานะอื่นๆ ยอมให้ข้อมูลแหว่งได้ แต่ต้อง "ตรงชนิด" ตาม schema (partial)
      //    ป้องกัน garbage data ประเภทแปลกๆ หลุดเข้าไปโชว์หน้า staff
      const partialResult = patientFormSchema.partial().safeParse(body.formData);
      if (!partialResult.success) {
        return NextResponse.json(
          { success: false, error: 'ข้อมูลไม่ถูกต้อง' },
          { status: 400 }
        );
      }
    }

    await pusherServer.trigger('patient-channel', 'form-update', body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pusher error:', error);
    return NextResponse.json(
      { success: false, error: 'ไม่สามารถซิงก์ข้อมูลได้' },
      { status: 500 }
    );
  }
}