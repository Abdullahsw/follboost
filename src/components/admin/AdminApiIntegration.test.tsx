import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminApiIntegration from "./AdminApiIntegration";

describe("AdminApiIntegration", () => {
  test("renders the component", () => {
    render(<AdminApiIntegration />);
    expect(screen.getByText("إدارة تكامل API")).toBeInTheDocument();
  });

  test("adds a new provider when form is submitted", async () => {
    render(<AdminApiIntegration />);

    // Switch to the add tab
    fireEvent.click(screen.getByText("إضافة مزود جديد"));

    // Fill the form
    fireEvent.change(screen.getByLabelText("اسم مزود الخدمة"), {
      target: { value: "Test Provider" },
    });
    fireEvent.change(screen.getByLabelText("عنوان API"), {
      target: { value: "https://api.test.com" },
    });
    fireEvent.change(screen.getByLabelText("مفتاح API"), {
      target: { value: "test-api-key" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("إضافة مزود الخدمة"));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText("تمت العملية بنجاح!")).toBeInTheDocument();
    });
  });
});
