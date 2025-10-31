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
  const cards = [
    {
      icon: (
        <div className="relative flex items-center justify-center w-6 h-6">
          <div className="absolute inset-0 rounded-full border-2 border-[#4f46e5]" />
          <DollarSign size={13} strokeWidth={2} className="text-[#4f46e5]" />
        </div>
      ),
      title: "Total de transacciones",
      data: totalTransactions,
    },
    {
      icon: <Star className="w-5 h-5 text-[#4f46e5]" />,
      title: "Operación favorita",
      data: favoriteOperation,
    },
    {
      icon: <Clock className="w-5 h-5 text-[#4f46e5]" />,
      title: "Hora con más transacciones",
      data: peakHour,
    },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 w-full">
      {cards.map((card, i) => (
        <div
          key={i}
          className="min-w-[110px] flex flex-col justify-between rounded-[12px] border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow duration-150 bg-white p-3 sm:p-5 overflow-hidden box-border"
        >
          <div className="flex flex-col items-start min-w-0 min-h-0 flex-1">
            {/* Icon */}
            <div className="bg-[#c7d2fe] flex items-center justify-center rounded-full w-10 h-10 sm:w-12 sm:h-12 mb-2 flex-shrink-0">
              {card.icon}
            </div>

            {/* Title */}
            <p
              className="text-[#444] mb-1 mt-1 max-w-full"
              style={{
                fontSize: "clamp(11px, 2.1vw, 13px)", // ↓ reduced slightly
                lineHeight: 1.25,
                wordBreak: "keep-all",
                overflowWrap: "normal",
                hyphens: "none",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {card.title}
            </p>

            {/* Value */}
            <p
              className="font-['Poppins-SemiBold'] text-[#444] my-1 max-w-full"
              style={{
                fontSize: "clamp(13px, 2.9vw, 20px)", // ↓ slightly reduced
                lineHeight: 1.18,
                whiteSpace: "normal",
                wordBreak: "keep-all",
                overflowWrap: "normal",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              title={card.data.value}
            >
              {card.data.value}
            </p>

            {/* Change */}
            <div className="flex items-center gap-1 mt-1">
              <ArrowUp
                className={`w-3.5 h-3.5 ${
                  card.data.isPositive ? "text-[#10b981]" : "text-[#ef4444]"
                } flex-shrink-0`}
              />
              <p
                className={`font-['Poppins-SemiBold'] ${
                  card.data.isPositive ? "text-[#10b981]" : "text-[#ef4444]"
                } max-w-full`}
                style={{
                  fontSize: "clamp(10px, 0.9vw, 12px)", // ↓ reduced
                  wordBreak: "keep-all",
                  overflowWrap: "normal",
                }}
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

export default SummaryCards;
