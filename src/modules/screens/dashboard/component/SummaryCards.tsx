import { DollarSign, Star, Clock, ArrowUp } from "lucide-react";

interface SummaryData {
  value: string;
  change: number;
  isPositive: boolean;
}

interface SummaryCardsProps {
  totalTransactions: SummaryData;
  favoriteOperation: SummaryData;
  peakHour: SummaryData;
}

export function SummaryCards({
  totalTransactions,
  favoriteOperation,
  peakHour,
}: SummaryCardsProps) {
  return (
    <div className="flex gap-[12px] sm:gap-[16px] lg:gap-[20px] items-stretch overflow-x-auto scrollbar-hide pb-2 w-full">
      {[
        {
          icon: (
            <div className="relative flex items-center justify-center w-[24px] h-[24px]">
              <div className="absolute inset-0 rounded-full border-[2px] border-[#4f46e5]" />
              <DollarSign size={14} strokeWidth={2} className="text-[#4f46e5]" />
            </div>
          ),
          title: "Total de transacciones",
          data: totalTransactions,
        },
        {
          icon: <Star className="size-[24px] text-[#4f46e5]" />,
          title: "Operación favorita",
          data: favoriteOperation,
        },
        {
          icon: <Clock className="size-[24px] text-[#4f46e5]" />,
          title: "Hora con más transacciones",
          data: peakHour,
        },
      ].map((card, i) => (
        <div
          key={i}
          className="basis-0 grow min-w-[140px] max-w-[200px] sm:min-w-[160px] sm:max-w-none rounded-[12px]
            border border-[#e5e7eb] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)]
            hover:shadow-[0px_4px_12px_0px_rgba(0,0,0,0.16)]
            transition-shadow duration-150 bg-white flex-shrink-0"
        >
          <div className="box-border flex flex-col items-start justify-start p-[14px] sm:p-[18px] lg:p-[20px] text-left w-full">
            <div className="bg-[#c7d2fe] flex items-center justify-center rounded-full size-[44px] sm:size-[54px] lg:size-[60px] mb-2">
              {card.icon}
            </div>
            <p className="font-['Poppins-Regular'] leading-[18px] text-[#444444] text-[13px] sm:text-[14px] lg:text-[15px] mb-1">
              {card.title}
            </p>
            <p className="font-['Poppins-SemiBold'] leading-[28px] sm:leading-[32px] lg:leading-[36px] text-[#444444] text-[18px] sm:text-[20px] lg:text-[22px] mb-1">
              {card.data.value}
            </p>
            <div className="flex items-center gap-[4px]">
              <ArrowUp
                className={`size-[14px] sm:size-[16px] ${
                  card.data.isPositive ? "text-[#10b981]" : "text-[#ef4444]"
                }`}
              />
              <p
                className={`font-['Poppins-SemiBold'] leading-[16px] ${
                  card.data.isPositive ? "text-[#10b981]" : "text-[#ef4444]"
                } text-[12px] sm:text-[13px]`}
              >
                {card.data.change}%
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
