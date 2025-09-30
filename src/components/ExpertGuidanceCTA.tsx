import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ExpertGuidanceCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-6">
      <div className="bg-[#2d5a4a] text-white rounded-3xl p-8">
        <h2 className="text-2xl font-bold mb-3">Need Expert Guidance?</h2>
        <p className="text-white/90 mb-6 text-base">
          Speak to our property advisors for personalized recommendations
        </p>
        <Button
          onClick={() => navigate("/contact-advisor")}
          className="rounded-xl px-6 bg-white text-[#2d5a4a] hover:bg-white/90 font-medium"
          size="lg"
        >
          Contact an Advisor
        </Button>
      </div>
    </section>
  );
};

export default ExpertGuidanceCTA;
