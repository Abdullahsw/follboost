import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Language {
  code: string;
  name: string;
  flag: string;
  rtl: boolean;
}

const LanguageSwitcher = () => {
  const languages: Language[] = [
    { code: "ar", name: "العربية", flag: "🇸🇦", rtl: true },
    { code: "en", name: "English", flag: "🇺🇸", rtl: false },
    { code: "fr", name: "Français", flag: "🇫🇷", rtl: false },
    { code: "tr", name: "Türkçe", flag: "🇹🇷", rtl: false },
  ];

  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages[0],
  );

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    // In a real app, this would update the app's language context/state
    // and possibly store the preference in localStorage or cookies
    document.documentElement.dir = language.rtl ? "rtl" : "ltr";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>{currentLanguage.flag}</span>
          <span>{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="flex items-center justify-between"
          >
            <span>
              {language.flag} {language.name}
            </span>
            {currentLanguage.code === language.code && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
