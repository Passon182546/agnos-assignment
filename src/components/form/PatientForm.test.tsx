import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PatientForm from "./PatientForm";
import { fireEvent } from "@testing-library/react";

// จำลองฟังก์ชัน alert() เพื่อไม่ให้เกิด Error ในโหมดทดสอบ (เนื่องจาก Node.js ไม่มี window.alert)
beforeAll(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

describe("PatientForm Component", () => {
  it("เรนเดอร์หัวข้อและช่องกรอกข้อมูลครบถ้วน", () => {
    render(<PatientForm />);

    // ตรวจสอบการเรนเดอร์หัวข้อและปุ่ม
    expect(
      screen.getByText("ข้อมูลผู้ป่วย (Patient Information)"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ส่งข้อมูล" }),
    ).toBeInTheDocument();

    // ตรวจสอบช่องกรอกหลักๆ
    expect(screen.getByLabelText(/ชื่อจริง/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/นามสกุล/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/เบอร์โทรศัพท์/i)).toBeInTheDocument();
  });

  it("แสดงข้อความแจ้งเตือนเมื่อกดส่งข้อมูลโดยไม่กรอกข้อมูลที่จำเป็น", async () => {
    const user = userEvent.setup();
    render(<PatientForm />);

    // กดปุ่มส่งข้อมูลทันทีโดยที่ยังว่างเปล่า
    const submitButton = screen.getByRole("button", { name: "ส่งข้อมูล" });
    await user.click(submitButton);

    // การทำงานของ React Hook Form เป็นแบบ Asynchronous เราจึงต้องใช้ findByText เพื่อรอให้ข้อความปรากฏ
    expect(await screen.findByText("กรุณากรอกชื่อจริง")).toBeInTheDocument();
    expect(await screen.findByText("กรุณากรอกนามสกุล")).toBeInTheDocument();
    expect(await screen.findByText("กรุณาระบุเพศ")).toBeInTheDocument();
  });

  it("ดักจับและแจ้งเตือนทันทีเมื่อเบอร์โทรศัพท์ผิดรูปแบบ (โหมด onChange)", async () => {
    const user = userEvent.setup();
    render(<PatientForm />);

    const phoneInput = screen.getByLabelText(/เบอร์โทรศัพท์/i);

    // จำลองการพิมพ์ตัวเลขแค่ 4 ตัว (ผิดเงื่อนไข Zod ที่ต้องมี 9-10 ตัว)
    await user.type(phoneInput, "1234");

    // ระบบควรแจ้งเตือนทันทีโดยไม่ต้องกด Submit
    expect(
      await screen.findByText(
        "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 9-10 หลัก)",
      ),
    ).toBeInTheDocument();
  });

  it("สามารถกดส่งข้อมูลได้เมื่อกรอกข้อมูลถูกต้องและครบถ้วน", async () => {
    const user = userEvent.setup();
    render(<PatientForm />);

    // กรอกข้อมูลในช่องที่จำเป็น (Required) ให้ครบ
    await user.type(screen.getByLabelText(/ชื่อจริง/i), "พัสสน");
    await user.type(screen.getByLabelText(/นามสกุล/i), "สุดหล่อ");
    // แทนที่บรรทัดเดิม
    const dateInput = screen.getByLabelText(/วันเกิด/i);
    fireEvent.change(dateInput, { target: { value: "1990-01-01" } });
    await user.selectOptions(screen.getByLabelText(/เพศ/i), "male");
    await user.type(screen.getByLabelText(/เบอร์โทรศัพท์/i), "0812345678");
    await user.type(screen.getByLabelText(/ที่อยู่/i), "123 ถ.สุขุมวิท กทม.");
    await user.selectOptions(screen.getByLabelText(/ภาษาที่ถนัด/i), "thai");
    await user.type(screen.getByLabelText(/สัญชาติ/i), "ไทย");

    // กดส่งข้อมูล
    const submitButton = screen.getByRole("button", { name: "ส่งข้อมูล" });
    await user.click(submitButton);

    // ตรวจสอบว่าฟังก์ชัน onSubmit ทำงานสำเร็จ โดยดูจากการเรียกใช้งาน alert()
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "ตรวจสอบข้อมูลถูกต้อง (เดี๋ยวเราจะเชื่อมระบบ Real-time ในภายหลัง)",
      );
    });
  });
});
