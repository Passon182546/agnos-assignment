import { renderHook, act, waitFor } from '@testing-library/react';
import { useFormSync } from './useFormSync';

describe('useFormSync Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Mock global.fetch properly
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('ไม่ควรเรียก API ถ้า sessionId เป็นค่าว่าง', () => {
    renderHook(() => useFormSync('', { name: 'test' }, false));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('ควรเปลี่ยนสถานะเป็น submitted ทันทีเมื่อ isSubmitted เป็น true', () => {
    const { result } = renderHook(() => useFormSync('id-1', { name: 'test' }, true));
    expect(result.current).toBe('submitted');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('ควรหน่วงเวลา (Debounce) 500ms ก่อนส่งข้อมูล actively filling in', () => {
    const { rerender } = renderHook(
      ({ data }) => useFormSync('id-1', data, false),
      { initialProps: { data: {} } }
    );
    
    // API ต้องไม่ถูกเรียกทันที
    expect(global.fetch).not.toHaveBeenCalled();

    // Trigger useEffect by changing formData
    rerender({ data: { name: 'typing...' } });

    // เร่งเวลา 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // API ถูกเรียกหลังจาก 500ms debounce
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('ควรเปลี่ยนสถานะเป็น inactive เมื่อหยุดพิมพ์เกิน 3 วินาที', () => {
    const { rerender } = renderHook(
      ({ data }) => useFormSync('id-1', data, false),
      { initialProps: { data: {} } }
    );
    
    // Trigger useEffect by changing formData
    rerender({ data: { name: 'done' } });
    
    // เร่งเวลาไป 500ms (debounce)
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // เร่งเวลาไปอีก 2500ms = รวม 3000ms (เพื่อให้ inactive timeout trigger)
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    
    // API ถูกเรียก 2 ครั้ง (ตอน 500ms debounce และตอน 3000ms inactive)
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('ควรเคลียร์ Timeout เมื่อ Component ถูก Unmount (คลุมบรรทัด 57-58)', () => {
    const { unmount } = renderHook(() => useFormSync('id-1', { name: 'test' }, false));
    
    // สั่งทำลาย Component เพื่อจำลองการปิดหน้าจอ
    unmount();
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // API ต้องไม่ถูกเรียกเลย เพราะ Timeout ถูกลบไปแล้ว
    expect(global.fetch).not.toHaveBeenCalled();
  });
});