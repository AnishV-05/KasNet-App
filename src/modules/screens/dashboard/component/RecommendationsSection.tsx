import { useState } from "react";
import { Lightbulb } from "lucide-react";

const recommendations = [
  "Realiza más recargas en horarios con más demandas (5 p. m. y 8 p. m.) para aumentar tus operaciones.",
  "Los pagos de servicios tienen mayor demanda los primeros días del mes. Prepárate para atender más clientes.",
  "Las transacciones digitales están creciendo. Considera promover tu canal App para más comodidad.",
  "Tu operación favorita genera buenos ingresos. Considera ofrecer promociones para aumentar el volumen.",
];

export function RecommendationsSection() {
  const [currentRecommendation, setCurrentRecommendation] = useState(0);

  return (
    <div className="flex flex-col gap-[14px] sm:gap-[16px] items-center w-full">
      {/* Title - Desktop Only */}
      <p className="hidden md:block font-['Poppins-SemiBold'] text-[#444444] text-[18px] sm:text-[20px] w-full">
        Recomendaciones
      </p>

      <div className="bg-[#edf1ff] rounded-[10px] w-full shadow-[0_1px_6px_0_rgba(75,75,187,0.06)]">
        <div className="box-border flex gap-[10px] items-center p-[13px] sm:p-[16px]">
          <div className="flex flex-col items-center justify-center flex-shrink-0 p-[5px]">
            <Lightbulb className="size-[26px] sm:size-[32px] text-[#4B4BBB]" />
          </div>
          <div className="basis-0 flex flex-col gap-[4px] grow items-start">
            <p className="font-['Poppins-SemiBold'] font-semibold text-[#444444] text-[15px] sm:text-[16px]">
              Te recomendamos
            </p>
            <p className="font-['Poppins-Regular'] text-[#444444] text-[13px] sm:text-[15px]">
              {recommendations[currentRecommendation]}
            </p>
          </div>
        </div>
      </div>

      {/* Carousel Dots (touch-friendly) */}
      <div className="flex gap-[7px] items-center mt-[-4px]">
        {recommendations.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentRecommendation(index)}
            className={`rounded-full w-[11px] h-[11px] transition-all outline-none focus:ring-2 ring-[#aab5ff] ${
              index === currentRecommendation ? "bg-[#4B4BBB]" : "bg-[#AAB5FF] opacity-60"
            }`}
            aria-label={`Go to recommendation ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
