import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ServicesPricing from "./ServicesPricing";
import ApiSection from "./ApiSection";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import TermsConditions from "./TermsConditions";
import LanguageSwitcher from "./LanguageSwitcher";
import PublicHeader from "./PublicHeader";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PublicHeader />

      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">FollBoost</h1>
          <p className="text-xl md:text-2xl mb-8">
            منصة خدمات وسائل التواصل الاجتماعي المتكاملة
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/login")}
            >
              تسجيل الدخول
            </Button>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => navigate("/register")}
            >
              إنشاء حساب جديد
            </Button>
          </div>
        </div>
      </section>

      {/* Services and Pricing Section */}
      <section className="py-16 px-4" id="services">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            خدماتنا وأسعارنا
          </h2>
          <ServicesPricing />
        </div>
      </section>

      {/* API Section */}
      <section className="py-16 px-4 bg-gray-100" id="api">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            واجهة برمجة التطبيقات (API)
          </h2>
          <ApiSection />
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 px-4" id="about">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">من نحن</h2>
          <AboutUs />
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 px-4 bg-gray-100" id="contact">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">اتصل بنا</h2>
          <ContactUs />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FollBoost</h3>
              <p className="text-gray-300">
                منصة خدمات وسائل التواصل الاجتماعي المتكاملة
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#services"
                    className="text-gray-300 hover:text-white"
                  >
                    خدماتنا
                  </a>
                </li>
                <li>
                  <a href="#api" className="text-gray-300 hover:text-white">
                    API
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-300 hover:text-white">
                    من نحن
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-white">
                    اتصل بنا
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">الشروط والأحكام</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/terms" className="text-gray-300 hover:text-white">
                    الشروط والأحكام
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-300 hover:text-white"
                  >
                    سياسة الخصوصية
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">اللغة</h3>
              <LanguageSwitcher />
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © {new Date().getFullYear()} FollBoost. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
