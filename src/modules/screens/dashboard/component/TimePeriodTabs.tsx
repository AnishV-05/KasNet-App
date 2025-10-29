type TimePeriod = "Diario" | "Semanal" | "Mensual";

interface TimePeriodTabsProps {
  timePeriod: TimePeriod;
  setTimePeriod: (period: TimePeriod) => void;
}

export function TimePeriodTabs({ timePeriod, setTimePeriod }: TimePeriodTabsProps) {
  const periods: TimePeriod[] = ["Diario", "Semanal", "Mensual"];

  return (
    <div className="flex gap-[8px] sm:gap-[12px] items-center">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => setTimePeriod(period)}
          className={`flex gap-[4px] items-center justify-center px-[10px] sm:px-[14px] py-[5px] sm:py-[7px] rounded-[8px] border transition-colors duration-150 outline-none focus:ring-2 ring-[#aab5ff]
            ${timePeriod === period
              ? "bg-[#edf1ff] border-[#4b4bbb] shadow-[0_2px_8px_0_rgba(75,75,187,0.06)]"
              : "bg-white border-[#e5e7eb] hover:bg-[#f7f7fe] hover:border-[#aab5ff]"}
          `}
        >
          <span className={`font-['Poppins-Medium'] leading-[21px] text-[15px] sm:text-[16px] ${
            timePeriod === period ? "text-[#4b4bbb]" : "text-[#6f7276]"
          }`}>
            {period}
          </span>
        </button>
      ))}
    </div>
  );
}
