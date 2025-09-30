import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ExpertGuidanceCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-6 bg-gray-50">
      <div className="bg-primary text-white rounded-3xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Need expert guidance?</h2>
        <p className="text-white/90 mb-6">
          Speak to our property advisors for personalized recommendations
        </p>
        <Button
          onClick={() => navigate("/contact-advisor")}
          variant="secondary"
          size="lg"
          className="rounded-full px-8"
        >
          Contact an Advisor
        </Button>
      </div>
    </section>
  );
};

export default ExpertGuidanceCTA;
