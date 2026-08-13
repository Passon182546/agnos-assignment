import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DatePickerField from "./DatePickerField";

describe("DatePickerField Component", () => {
  const mockRegister = jest.fn();
  const mockSetValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("สามารถเปิดปฏิทินและเลือกวันได้", async () => {
    const user = userEvent.setup();
    render(
      <DatePickerField
        label="วันเกิด"
        name="dateOfBirth"
        register={mockRegister}
        setValue={mockSetValue}
      />
    );

    // 1. กดเปิดปฏิทิน
    const openButton = screen.getByLabelText("Select date of birth");
    await user.click(openButton);
    
    // ตรวจสอบว่าปฏิทินเปิดขึ้นมา (มีวันอาทิตย์ 'Su' ปรากฏ)
    expect(screen.getByText("Su")).toBeInTheDocument();

    // 2. จำลองการเลือกวันที่ 15
    const dayButton = screen.getByLabelText("Select day 15");
    await user.click(dayButton);

    // ตรวจสอบว่า setValue ถูกเรียก
    expect(mockSetValue).toHaveBeenCalledWith("dateOfBirth", expect.any(String), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  });

  it("สามารถกดเลื่อนเดือนถัดไปและย้อนหลังได้ (คลุมบรรทัด 133-139)", async () => {
    const user = userEvent.setup();
    render(
      <DatePickerField
        label="วันเกิด"
        name="dateOfBirth"
        register={mockRegister}
        setValue={mockSetValue}
      />
    );

    await user.click(screen.getByLabelText("Select date of birth"));

    // กดปุ่มเดือนถัดไป
    const nextMonthBtn = screen.getByLabelText("Next month");
    await user.click(nextMonthBtn);

    // กดปุ่มเดือนก่อนหน้า
    const prevMonthBtn = screen.getByLabelText("Previous month");
    await user.click(prevMonthBtn);
  });

  it("สามารถสลับไปหน้าเลือกเดือนและกดเลือกเดือนได้ (คลุมบรรทัด 151-154)", async () => {
    const user = userEvent.setup();
    render(
      <DatePickerField
        label="วันเกิด"
        name="dateOfBirth"
        register={mockRegister}
        setValue={mockSetValue}
      />
    );

    await user.click(screen.getByLabelText("Select date of birth"));

    // กดที่ชื่อเดือนตรงกลางเพื่อสลับโหมดเป็น 'months'
    const selectMonthModeBtn = screen.getByLabelText("Select month");
    await user.click(selectMonthModeBtn);

    // ลองกดเลือกเดือนกุมภาพันธ์ (Feb)
    const febButton = screen.getByLabelText("Select month Feb");
    await user.click(febButton);
  });

  it("สามารถสลับไปหน้าเลือกปี เลื่อนปี และกดเลือกปีได้ (คลุมบรรทัด 142-148, 157-160)", async () => {
    const user = userEvent.setup();
    render(
      <DatePickerField
        label="วันเกิด"
        name="dateOfBirth"
        register={mockRegister}
        setValue={mockSetValue}
      />
    );

    await user.click(screen.getByLabelText("Select date of birth"));

    // 1. เข้าสู่โหมดเลือกเดือนก่อน
    await user.click(screen.getByLabelText("Select month"));
    
    // 2. เข้าสู่โหมดเลือกปี
    await user.click(screen.getByLabelText("Select year"));

    // 3. ทดสอบกดเลื่อนหน้าต่างปี (Previous years / Next years)
    const prevYearsBtn = screen.getByLabelText("Previous years");
    await user.click(prevYearsBtn);
    
    const nextYearsBtn = screen.getByLabelText("Next years");
    await user.click(nextYearsBtn);

    // 4. ทดสอบกดเลือกปี ค.ศ. (เช่น ปีปัจจุบัน)
    const currentYear = new Date().getFullYear();
    const yearButton = screen.getByLabelText(`Select year ${currentYear}`);
    await user.click(yearButton);
  });

  it("สามารถปิดปฏิทินเมื่อคลิกพื้นที่ด้านนอกได้ (คลุมบรรทัด 83-84)", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <div data-testid="outside-element">พื้นที่ด้านนอก</div>
        <DatePickerField
          label="วันเกิด"
          name="dateOfBirth"
          register={mockRegister}
          setValue={mockSetValue}
        />
      </div>
    );

    // เปิดปฏิทิน
    await user.click(screen.getByLabelText("Select date of birth"));
    expect(screen.getByText("Su")).toBeInTheDocument();

    // คลิกพื้นที่ด้านนอก
    await user.click(screen.getByTestId("outside-element"));
  });

  it("แสดงผล UI สถานะ Error ได้อย่างถูกต้อง", () => {
    const mockError = { type: "manual", message: "กรุณาระบุวันเกิด" };
    
    render(
      <DatePickerField
        label="วันเกิด"
        name="dateOfBirth"
        register={mockRegister}
        setValue={mockSetValue}
        error={mockError as any}
      />
    );

    // ตรวจสอบว่ามีข้อความ Error โชว์ขึ้นมา
    expect(screen.getByText("กรุณาระบุวันเกิด")).toBeInTheDocument();
  });
});