import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const MobileFooter = () => {
  return (
    <footer className="bg-gray-100">
      <div className="px-4 pt-4 pb-2">
        <div className="flex justify-center gap-6 mb-3">
          <button className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors">
            <Facebook className="h-6 w-6 text-blue-600" />
          </button>
          <button className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
            <Twitter className="h-6 w-6 text-blue-400" />
          </button>
          <button className="h-14 w-14 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors">
            <Instagram className="h-6 w-6 text-pink-600" />
          </button>
          <button className="h-14 w-14 rounded-full bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors">
            <Mail className="h-6 w-6 text-green-600" />
          </button>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          © 2024 Holibayt • Algeria's trusted real estate platform
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;
