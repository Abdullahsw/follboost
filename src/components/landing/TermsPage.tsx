import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TermsConditions from "./TermsConditions";
import PublicHeader from "./PublicHeader";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="mb-8 flex justify-between items-center">
            <Button asChild variant="outline">
              <Link to="/">العودة إلى الصفحة الرئيسية</Link>
            </Button>
            <h1 className="text-3xl font-bold">الشروط والأحكام</h1>
          </div>

          <TermsConditions />

          <div className="mt-12 flex justify-center">
            <Button asChild>
              <Link to="/">العودة إلى الصفحة الرئيسية</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
