import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ExpertGuidanceCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-6">
      <div className="bg-[#2C5F5F] text-white rounded-3xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Need Expert Guidance?</h2>
        <p className="text-white/90 mb-6 text-lg">
          Speak to our property advisors for personalized recommendations
        </p>
        <Button
          onClick={() => navigate("/contact-advisor")}
          className="rounded-full px-8 bg-white text-[#2C5F5F] hover:bg-white/90 font-semibold"
          size="lg"
        >
          Contact an Advisor
        </Button>
      </div>
    </section>
  );
};

export default ExpertGuidanceCTA;
