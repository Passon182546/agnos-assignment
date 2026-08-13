import { renderHook, act, waitFor } from '@testing-library/react';
import { useFormSync } from './useFormSync';

describe('useFormSync Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
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

  it('ควรหน่วงเวลา (Debounce) 500ms ก่อนส่งข้อมูล actively filling in', async () => {
    const { result } = renderHook(() => useFormSync('id-1', { name: 'typing...' }, false));
    
    // ใช้ waitFor เพื่อรอให้ React อัปเดต State จาก useEffect ให้เสร็จก่อน
    await waitFor(() => {
      expect(result.current).toBe('actively filling in');
    });
    
    expect(global.fetch).not.toHaveBeenCalled();

    // เร่งเวลา 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('ควรเปลี่ยนสถานะเป็น inactive เมื่อหยุดพิมพ์เกิน 3 วินาที', async () => {
    const { result } = renderHook(() => useFormSync('id-1', { name: 'done' }, false));
    
    // เร่งเวลาไป 3 วินาที
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // รอให้สถานะเปลี่ยน
    await waitFor(() => {
      expect(result.current).toBe('inactive');
    });
    
    // API ถูกเรียก 2 ครั้ง (ตอน 500ms และตอน 3000ms)
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

  it('จัดการ Error ได้เมื่อระบบ Network ล้มเหลว (คลุมบรรทัด 27-28)', async () => {
    // จำลองให้ API พัง และดักฟัง console.error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    renderHook(() => useFormSync('id-1', { name: 'test-error' }, false));

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // ตรวจสอบว่าระบบ Catch Error และ Log ออกมาจริงๆ
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error syncing form data:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});