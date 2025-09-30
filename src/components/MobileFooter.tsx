import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const MobileFooter = () => {
  return (
    <footer className="bg-background border-t border-border pb-20">
      <div className="px-4 py-8">
        <div className="flex justify-center gap-6 mb-6">
          <button className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Facebook className="h-5 w-5 text-blue-600" />
          </button>
          <button className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Twitter className="h-5 w-5 text-blue-400" />
          </button>
          <button className="h-12 w-12 rounded-full bg-pink-50 flex items-center justify-center">
            <Instagram className="h-5 w-5 text-pink-600" />
          </button>
          <button className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
            <Mail className="h-5 w-5 text-green-600" />
          </button>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          © 2024 Holibayt • Algeria's Trusted Real Estate Platform
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;
