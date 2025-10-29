import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar } from "lucide-react";

interface ChartData {
  day: number;
  value: number;
}

interface ChartSectionProps {
  timePeriod: string;
  chartData: ChartData[];
}

export function ChartSection({ timePeriod, chartData }: ChartSectionProps) {
  return (
    <div className="w-full lg:col-start-1 lg:col-end-2">
      {/* Heading + subtitle */}
      <div className="w-full flex justify-start mb-[12px]">
        <div className="max-w-[760px] w-full">
          <h2 className="font-['Poppins-SemiBold'] font-semibold text-[#222222] text-[16px] sm:text-[18px] md:text-[20px] mb-[6px]">
            Rendimiento de transacciones
          </h2>
          <div className="flex items-center gap-[7px]">
            <Calendar className="w-[13px] h-[13px] sm:w-[14px] sm:h-[14px] text-[#6f7276]" />
            <p className="font-['Poppins-Regular'] text-[#6f7276] text-[10px] sm:text-[11px] md:text-[12px] leading-[18px]">
              Tabla {timePeriod.toLowerCase()} de los últimos 30 días
            </p>
          </div>
        </div>
      </div>
      {/* Responsive AreaChart */}
      <div className="w-full h-[180px] xs:h-[220px] sm:h-[250px] md:h-[280px] lg:h-[300px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4B4BBB" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4B4BBB" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "#6f7276" }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 8, right: 8 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#6f7276" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${Math.round(value / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e6e6e6",
                borderRadius: 8,
                padding: "8px 10px",
              }}
              formatter={(value: number) => [`${value.toLocaleString()} trxs`, "Transacciones"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#4B4BBB"
              strokeWidth={2}
              fill="url(#colorValue)"
              fillOpacity={1}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
