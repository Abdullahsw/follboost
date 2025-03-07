import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminChildPanel from "./AdminChildPanel";

describe("AdminChildPanel", () => {
  test("renders the component", () => {
    render(<AdminChildPanel />);
    expect(screen.getByText("نظام اللوحات الفرعية")).toBeInTheDocument();
  });

  test("creates a new child panel when form is submitted", async () => {
    render(<AdminChildPanel />);

    // Switch to the create tab
    fireEvent.click(screen.getByText("إنشاء لوحة فرعية"));

    // Fill the form
    fireEvent.change(screen.getByLabelText("اسم اللوحة الفرعية"), {
      target: { value: "Test Panel" },
    });
    fireEvent.change(screen.getByLabelText("البريد الإلكتروني للمالك"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(
      screen.getByLabelText("النطاق الفرعي").querySelector("input"),
      {
        target: { value: "test" },
      },
    );

    // Submit the form
    fireEvent.click(screen.getByText("إنشاء اللوحة الفرعية"));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText("تمت العملية بنجاح!")).toBeInTheDocument();
    });
  });
});
