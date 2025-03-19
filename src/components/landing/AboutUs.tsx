import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const AboutUs = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 text-right">
          <h3 className="text-2xl font-bold">About Us</h3>
          <p className="text-gray-700">
            FollBoost is a leading platform in the field of social media
            services, established in 2020 with the aim of providing innovative
            and effective solutions to enhance the digital presence of
            individuals and companies across various social media platforms.
          </p>
          <p className="text-gray-700">
            We pride ourselves on providing high-quality and completely secure
            services, with a focus on customer satisfaction and achieving
            tangible results. Our team of experts works continuously to develop
            and improve our services to keep pace with the constant changes in
            the world of social media.
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 space-y-4 text-right">
          <h3 className="text-2xl font-bold">Our Vision</h3>
          <p className="text-gray-700">
            To be the first and best choice in the field of social media
            enhancement services in the Middle East, by providing distinguished
            services and innovative solutions that help our customers achieve
            their digital goals.
          </p>
          <h3 className="text-2xl font-bold mt-6">Our Mission</h3>
          <p className="text-gray-700">
            Empowering individuals and companies to build and enhance their
            digital presence in safe and effective ways, providing high-quality
            services at competitive prices, while ensuring a smooth user
            experience and excellent technical support.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold text-center mb-8">
          Why Choose FollBoost?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-right">
              <h4 className="text-xl font-bold mb-2">High Quality</h4>
              <p className="text-gray-700">
                We provide high-quality services from real and secure sources,
                with guaranteed continuity of results.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-right">
              <h4 className="text-xl font-bold mb-2">Competitive Prices</h4>
              <p className="text-gray-700">
                Suitable prices for all categories with special discounts for
                large orders and regular customers.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-right">
              <h4 className="text-xl font-bold mb-2">24/7 Technical Support</h4>
              <p className="text-gray-700">
                A specialized technical support team is available around the
                clock to answer your inquiries and solve any problem.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-right">
              <h4 className="text-xl font-bold mb-2">
                User-Friendly Interface
              </h4>
              <p className="text-gray-700">
                A simple and easy-to-use platform that allows you to create and
                manage your orders with ease.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-right">
              <h4 className="text-xl font-bold mb-2">Integrated API</h4>
              <p className="text-gray-700">
                An integrated programming interface that allows you to integrate
                our services with your own systems and applications.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-right">
              <h4 className="text-xl font-bold mb-2">Security and Privacy</h4>
              <p className="text-gray-700">
                We ensure the security and privacy of your data, and we never
                ask for passwords for your accounts.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
