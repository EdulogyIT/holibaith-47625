import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FloatingMapButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate("/buy")}
      className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg z-40 hover:scale-110 transition-transform"
      style={{ 
        backgroundColor: 'hsl(var(--primary))',
        color: 'white'
      }}
      size="icon"
    >
      <Map className="h-6 w-6" />
    </Button>
  );
};

export default FloatingMapButton;
