"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FieldError, UseFormRegister, UseFormSetValue } from "react-hook-form";

interface DatePickerFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  error?: FieldError;
}

const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const getYearGrid = (baseYear: number) => {
  const startYear = Math.floor(baseYear / 10) * 10;
  const years = Array.from({ length: 12 }, (_, index) => startYear - 1 + index);
  return years;
};

const toLocalIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTodayIsoDate = () => toLocalIsoDate(new Date());

const formatDisplayDate = (value: string) => {
  if (!value) return "dd / mm / yyyy";

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "dd / mm / yyyy";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
};

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  name,
  register,
  setValue,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [viewDate, setViewDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<"days" | "months" | "years">("days");
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedDate) return;

    setValue(name, selectedDate, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [name, selectedDate, setValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(viewDate),
    [viewDate],
  );

  const firstDayOfMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1,
  ).getDay();

  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0,
  ).getDate();

  const calendarDays = useMemo(() => {
    const blanks = Array.from({ length: firstDayOfMonth }, () => null);
    const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
    return [...blanks, ...days];
  }, [daysInMonth, firstDayOfMonth]);

  const handleSelectDate = (day: number) => {
    const nextDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const nextIsoDate = toLocalIsoDate(nextDate);

    setSelectedDate(nextIsoDate);
    setViewDate(nextDate);
    setIsOpen(false);
  };

  const handleOpenCalendar = () => {
    setViewDate(new Date());
    setIsOpen(true);
  };

  const handleMonthChange = (direction: number) => {
    const nextMonth = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + direction,
      1,
    );
    setViewDate(nextMonth);
  };

  const handleYearChange = (direction: number) => {
    const nextYear = new Date(
      viewDate.getFullYear() + direction * 10,
      viewDate.getMonth(),
      1,
    );
    setViewDate(nextYear);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const nextMonth = new Date(viewDate.getFullYear(), monthIndex, 1);
    setViewDate(nextMonth);
    setViewMode("days");
  };

  const handleYearSelect = (year: number) => {
    const nextYear = new Date(year, viewDate.getMonth(), 1);
    setViewDate(nextYear);
    setViewMode("months");
  };

  const yearGrid = useMemo(() => getYearGrid(viewDate.getFullYear()), [viewDate]);

  const defaultHighlightDate = selectedDate || getTodayIsoDate();
  const selectedDay = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).getDate()
    : new Date(`${defaultHighlightDate}T00:00:00`).getDate();

  return (
    <div className="flex flex-col gap-1 w-full mb-4">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input type="hidden" id={name} {...register(name)} value={selectedDate} />

      <div className="relative">
        <button
          type="button"
          aria-label={selectedDate ? `Select date of birth, selected ${selectedDate}` : "Select date of birth"}
          onClick={handleOpenCalendar}
          className={`flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2.5 text-left shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-slate-300 focus:border-[#1A59C2] focus:ring-[#BFD4F8]"
          }`}
        >
          <span className={selectedDate ? "text-slate-700" : "text-slate-400"}>
            {selectedDate ? formatDisplayDate(selectedDate) : "dd / mm / yyyy"}
          </span>

          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-slate-500"
          >
            <path
              d="M6.25 2.5V4.167M13.75 2.5V4.167M3.333 7.5H16.667M5 5.833H15A1.667 1.667 0 0 1 16.667 7.5V15A1.667 1.667 0 0 1 15 16.667H5A1.667 1.667 0 0 1 3.333 15V7.5A1.667 1.667 0 0 1 5 5.833Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div
            ref={calendarRef}
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleMonthChange(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-slate-600 transition hover:bg-slate-100"
                aria-label="Previous month"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={() => setViewMode((prev) => (prev === "days" ? "months" : "days"))}
                className="rounded-md px-2 py-1 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
                aria-label="Select month"
              >
                {monthLabel}
              </button>

              <button
                type="button"
                onClick={() => handleMonthChange(1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-slate-600 transition hover:bg-slate-100"
                aria-label="Next month"
              >
                ›
              </button>
            </div>

            {viewMode === "months" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-700">
                  <button
                    type="button"
                    onClick={() => handleYearChange(-1)}
                    className="rounded-full p-1 hover:bg-white"
                    aria-label="Previous year"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("years")}
                    className="font-semibold"
                    aria-label="Select year"
                  >
                    {viewDate.getFullYear()}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleYearChange(1)}
                    className="rounded-full p-1 hover:bg-white"
                    aria-label="Next year"
                  >
                    ›
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {monthNames.map((month, index) => {
                    const isSelected = viewDate.getMonth() === index;

                    return (
                      <button
                        key={month}
                        type="button"
                        onClick={() => handleMonthSelect(index)}
                        aria-label={`Select month ${month}`}
                        className={`rounded-lg px-2 py-2 text-sm font-medium transition ${
                          isSelected
                            ? "bg-[#1A59C2] text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {month}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : viewMode === "years" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-700">
                  <button
                    type="button"
                    onClick={() => handleYearChange(-1)}
                    className="rounded-full p-1 hover:bg-white"
                    aria-label="Previous years"
                  >
                    ‹
                  </button>
                  <span className="font-semibold">
                    {Math.floor(viewDate.getFullYear() / 10) * 10} - {Math.floor(viewDate.getFullYear() / 10) * 10 + 9}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleYearChange(1)}
                    className="rounded-full p-1 hover:bg-white"
                    aria-label="Next years"
                  >
                    ›
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {yearGrid.map((year) => {
                    const isSelected = year === viewDate.getFullYear();

                    return (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearSelect(year)}
                        aria-label={`Select year ${year}`}
                        className={`rounded-lg px-2 py-2 text-sm font-medium transition ${
                          isSelected
                            ? "bg-[#1A59C2] text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
                  {weekdayLabels.map((label) => (
                    <div key={label}>{label}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-cell-${index}`} className="h-10 w-10" />;
                    }

                    const isSelected =
                      selectedDay === day &&
                      viewDate.getMonth() === new Date(`${defaultHighlightDate}T00:00:00`).getMonth() &&
                      viewDate.getFullYear() === new Date(`${defaultHighlightDate}T00:00:00`).getFullYear();

                    return (
                      <button
                        key={`day-${day}`}
                        type="button"
                        onClick={() => handleSelectDate(day)}
                        aria-label={`Select day ${day}`}
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm transition ${
                          isSelected
                            ? "bg-[#1A59C2] text-white shadow-sm"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error && <span className="text-xs text-red-500 mt-1">{error.message}</span>}
    </div>
  );
};

export default DatePickerField;
