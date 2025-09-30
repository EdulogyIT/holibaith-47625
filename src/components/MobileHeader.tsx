import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const MobileHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50 safe-top">
      <div className="flex items-center justify-between px-4 h-16">
        <img 
          src="/holibayt-logo-transparent.png" 
          alt="Holibayt" 
          className="h-10 w-auto"
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8">
              <a href="/" className="text-lg font-medium">Home</a>
              <a href="/buy" className="text-lg font-medium">Buy</a>
              <a href="/rent" className="text-lg font-medium">Rent</a>
              <a href="/short-stay" className="text-lg font-medium">Short Stay</a>
              <a href="/about" className="text-lg font-medium">About</a>
              <a href="/blog" className="text-lg font-medium">Blog</a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default MobileHeader;
