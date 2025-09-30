import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FloatingMapButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate("/buy")} // Navigate to buy page with map view
      className="fixed bottom-24 right-4 h-14 w-14 rounded-full bg-primary shadow-lg z-40 hover:scale-110 transition-transform"
      size="icon"
    >
      <Map className="h-6 w-6 text-white" />
    </Button>
  );
};

export default FloatingMapButton;
