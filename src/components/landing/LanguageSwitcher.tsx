import React from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  // English is now the only language
  return (
    <Button variant="outline" className="flex items-center gap-2" disabled>
      <Globe className="h-4 w-4" />
      <span>🇺🇸</span>
      <span>English</span>
    </Button>
  );
};

export default LanguageSwitcher;
