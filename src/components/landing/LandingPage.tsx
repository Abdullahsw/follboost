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
            Integrated Social Media Services Platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => navigate("/register")}
            >
              Create New Account
            </Button>
          </div>
        </div>
      </section>

      {/* Services and Pricing Section */}
      <section className="py-16 px-4" id="services">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Services and Pricing
          </h2>
          <ServicesPricing />
        </div>
      </section>

      {/* API Section */}
      <section className="py-16 px-4 bg-gray-100" id="api">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Application Programming Interface (API)
          </h2>
          <ApiSection />
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 px-4" id="about">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">About Us</h2>
          <AboutUs />
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 px-4 bg-gray-100" id="contact">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
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
                Integrated Social Media Services Platform
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#services"
                    className="text-gray-300 hover:text-white"
                  >
                    Our Services
                  </a>
                </li>
                <li>
                  <a href="#api" className="text-gray-300 hover:text-white">
                    API
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-300 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-white">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Terms & Conditions</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/terms" className="text-gray-300 hover:text-white">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-300 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Language</h3>
              <LanguageSwitcher />
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © {new Date().getFullYear()} FollBoost. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
