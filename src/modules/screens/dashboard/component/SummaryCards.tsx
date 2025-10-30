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
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
  {[
    {
      icon: (
        <div className="relative flex items-center justify-center w-6 h-6">
          <div className="absolute inset-0 rounded-full border-2 border-[#4f46e5]" />
          <DollarSign size={14} strokeWidth={2} className="text-[#4f46e5]" />
        </div>
      ),
      title: "Total de transacciones",
      data: totalTransactions,
    },
    {
      icon: <Star className="w-6 h-6 text-[#4f46e5]" />,
      title: "Operación favorita",
      data: favoriteOperation,
    },
    {
      icon: <Clock className="w-6 h-6 text-[#4f46e5]" />,
      title: "Hora con más transacciones",
      data: peakHour,
    },
  ].map((card, i) => (
    <div
      key={i}
      className="flex flex-col justify-between rounded-[12px] border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow duration-150 bg-white p-4 sm:p-5"
    >
      <div className="flex flex-col items-start">
        <div className="bg-[#c7d2fe] flex items-center justify-center rounded-full w-12 h-12 mb-2">
          {card.icon}
        </div>
        <p className="font-['Poppins-Regular'] text-[#444] text-sm sm:text-base mb-1">
          {card.title}
        </p>
        <p className="font-['Poppins-SemiBold'] text-[#444] text-xl sm:text-2xl mb-1">
          {card.data.value}
        </p>
        <div className="flex items-center gap-1">
          <ArrowUp
            className={`w-4 h-4 ${
              card.data.isPositive ? "text-[#10b981]" : "text-[#ef4444]"
            }`}
          />
          <p
            className={`font-['Poppins-SemiBold'] text-xs sm:text-sm ${
              card.data.isPositive ? "text-[#10b981]" : "text-[#ef4444]"
            }`}
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
