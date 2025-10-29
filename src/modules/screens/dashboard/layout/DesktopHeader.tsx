import { Store, Home, ChevronDown } from "lucide-react";

export function DesktopHeader() {
  return (
    <div className="bg-[#4b4bbb] flex gap-[16px] h-[80px] items-center px-[32px] py-[16px] w-full">
      {/* Logo */}
      <div className="flex items-center gap-[8px] grow">
        <img src="/images/kasnet-logo.png" alt="Kasnet Logo" />


      </div>

      {/* User Info */}
      <div className="flex gap-[14px] items-center">
        <div className="bg-[#aab5ff] flex items-center justify-center rounded-full size-[48px]">
          <Store className="size-[24px] text-[#4B4BBB]" />
        </div>
        <div className="flex flex-col items-start">
          <p className="font-semibold text-[16px] text-white leading-[24px]">
            Comercio Pepito
          </p>
          <div className="flex gap-[4px] items-center">
            <p className="text-[12px] text-white leading-[18px]">Terminal ID: 00032703</p>
            <div className="bg-white border border-[#4b4bbb] flex items-center justify-center rounded-full size-[24px]">
              <Home className="size-[14px] text-[#4B4BBB]" />
            </div>
          </div>
        </div>
        <ChevronDown className="size-[24px] text-[#F9CB00]" />
      </div>
    </div>
  );
}
