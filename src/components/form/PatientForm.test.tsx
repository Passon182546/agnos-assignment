import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PatientForm from "./PatientForm";

beforeAll(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

describe("PatientForm Component", () => {
  it("renders the main form structure correctly", () => {
    render(<PatientForm />);

    expect(screen.getByText("Patient Information")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit Information" })).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
  });

  it("displays a compact decade of years instead of all 120 birth years at once", async () => {
    const user = userEvent.setup();
    render(<PatientForm />);

    const dateTrigger = screen.getByRole("button", { name: /select date of birth/i });
    await user.click(dateTrigger);
    await user.click(screen.getByRole("button", { name: /select month/i }));
    await user.click(screen.getByRole("button", { name: /select year/i }));

    const yearButtons = screen.getAllByRole("button").filter((button) =>
      /^Select year \d{4}$/.test(button.getAttribute("aria-label") || ""),
    );

    expect(yearButtons.length).toBeLessThan(25);
    expect(yearButtons.length).toBeGreaterThan(0);
  });

  it("shows validation errors when required fields are empty", async () => {
    const user = userEvent.setup();
    render(<PatientForm />);

    const submitButton = screen.getByRole("button", { name: "Submit Information" });
    await user.click(submitButton);

    expect(await screen.findByText("Please enter your first name")).toBeInTheDocument();
    expect(await screen.findByText("Please enter your last name")).toBeInTheDocument();
    expect(await screen.findByText("Please select your gender")).toBeInTheDocument();
  });

  it("validates the phone number immediately in onChange mode", async () => {
    const user = userEvent.setup();
    render(<PatientForm />);

    const phoneInput = screen.getByLabelText(/Phone Number/i);
    await user.type(phoneInput, "1234");

    expect(
      await screen.findByText("Phone number format is invalid (must be 9-10 digits)"),
    ).toBeInTheDocument();
  });

  it("keeps the date field blank until the calendar is opened and defaults to today inside the picker", async () => {
    const user = userEvent.setup();
    render(<PatientForm />);

    expect(screen.getByRole("button", { name: /select date of birth/i })).toHaveTextContent("dd / mm / yyyy");

    const dateTrigger = screen.getByRole("button", { name: /select date of birth/i });
    await user.click(dateTrigger);

    expect(screen.getByText(/January|February|March|April|May|June|July|August|September|October|November|December/i)).toBeInTheDocument();
    const today = new Date();
    const todayDay = today.getDate();
    expect(screen.getByRole("button", { name: `Select day ${todayDay}` })).toBeInTheDocument();
  });

  it("accepts valid form submission when required information is complete", async () => {
    const user = userEvent.setup();
    render(<PatientForm />);

    await user.type(screen.getByLabelText(/First Name/i), "Pat");
    await user.type(screen.getByLabelText(/Last Name/i), "Smith");

    const dateTrigger = screen.getByRole("button", { name: /select date of birth/i });
    await user.click(dateTrigger);
    const today = new Date();
    await user.click(screen.getByRole("button", { name: `Select day ${today.getDate()}` }));

    // Select Gender
    const genderButton = screen.getAllByRole("button", { name: /-- Please select --/ })[0];
    await user.click(genderButton);
    await user.click(screen.getByRole("button", { name: "Male" }));

    await user.type(screen.getByLabelText(/Phone Number/i), "0812345678");
    await user.type(screen.getByLabelText(/Address/i), "123 Sukhumvit Road");

    // Select Preferred Language
    const languageButton = screen.getAllByRole("button", { name: /-- Please select --/ })[0];
    await user.click(languageButton);
    await user.click(screen.getByRole("button", { name: "Thai" }));

    await user.type(screen.getByLabelText(/Nationality/i), "Thai");

    const submitButton = screen.getByRole("button", { name: "Submit Information" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Submission successful! The staff has received your information.",
      );
    });
  });

  it("sends sync data to the API when the patient begins typing", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true } as Response);
    Object.defineProperty(global, "fetch", {
      value: fetchMock,
      writable: true,
      configurable: true,
    });

    render(<PatientForm />);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "Charlie" },
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/pusher",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      );
    }, { timeout: 2000 });
  });

  it("renders normally when crypto is unavailable", () => {
    const originalCrypto = global.crypto;
    Object.defineProperty(global, "crypto", { value: undefined, writable: true });

    render(<PatientForm />);

    expect(screen.getByText("Patient Information")).toBeInTheDocument();

    Object.defineProperty(global, "crypto", { value: originalCrypto, writable: true });
  });
});
