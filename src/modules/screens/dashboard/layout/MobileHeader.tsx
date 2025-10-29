import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MobileHeader() {
  const navigate = useNavigate();
  return (
    <div className="bg-white box-border flex gap-[16px] h-[62px] items-center justify-between px-[16px] py-[18px] shadow-[0px_0px_4px_0px_rgba(68,68,68,0.25)] w-full">
      <div className="flex gap-[10px] items-center shrink-0">
        <ArrowLeft onClick={() => navigate(-1)} className="size-[24px] text-[#4B4BBB]" />
      </div>
      <div className="flex gap-[10px] items-center justify-center flex-1">
        <p className="font-['Poppins-Medium'] leading-[24px] text-[#444444] text-[16px] text-center">
          Rendimiento
        </p>
      </div>
      <div className="w-[24px]" /> {/* Spacer for centering */}
    </div>
  );
}
