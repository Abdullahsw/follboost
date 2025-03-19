import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";

const ContactUs = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    alert("تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4" dir="ltr">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <Label htmlFor="name" className="block">
                Name
              </Label>
              <Input id="name" placeholder="Enter your full name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@domain.com"
                dir="ltr"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject" className="block">
                Subject
              </Label>
              <Input id="subject" placeholder="Message subject" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="block">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Write your message here..."
                className="min-h-[120px]"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6 text-right">
        <h3 className="text-xl font-bold">Contact Information</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-semibold">Email</h4>
              <p className="text-gray-600">support@follboost.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-semibold">Phone Number</h4>
              <p className="text-gray-600">+966 50 123 4567</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-semibold">Address</h4>
              <p className="text-gray-600">Riyadh, Saudi Arabia</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-semibold">Technical Support</h4>
              <p className="text-gray-600">Available 24/7</p>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <h3 className="text-xl font-bold mb-4">Follow Us on Social Media</h3>
          <div className="flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Instagram className="h-6 w-6 text-pink-600" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Twitter className="h-6 w-6 text-blue-400" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Facebook className="h-6 w-6 text-blue-600" />
            </a>
          </div>
        </div>

        <div className="pt-6">
          <h3 className="text-xl font-bold mb-4">Working Hours</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Sunday - Thursday</span>
              <span>9:00 AM - 10:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Friday - Saturday</span>
              <span>10:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
