// src/modules/screens/dashboard/component/ChartSection.tsx
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar } from "lucide-react";

interface ChartData {
  day: number;
  value: number;
}

interface ChartSectionProps {
  timePeriod: "Diario" | "Semanal" | "Mensual";
  chartData: ChartData[];
}

const MONTH_LABELS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function getDailyXTicks() {
  return Array.from({ length: 30 }, (_, i) => i + 1);
}
function getWeeklyXTicks() {
  // S1..S12 for 12 weeks (or 12 buckets)
  return Array.from({ length: 12 }, (_, i) => i + 1);
}
function getMonthlyXTicks() {
  // 12 months
  return Array.from({ length: 12 }, (_, i) => i + 1);
}

export function ChartSection({ timePeriod, chartData }: ChartSectionProps) {
  // X ticks
  const xTicks =
    timePeriod === "Diario"
      ? getDailyXTicks()
      : timePeriod === "Semanal"
      ? getWeeklyXTicks()
      : getMonthlyXTicks();

  // Y ticks depending on period (human friendly)
  let yTicks: number[] = [];
  if (timePeriod === "Diario") {
    yTicks = [0, 5000, 10000, 15000, 20000, 25000, 30000];
  } else if (timePeriod === "Semanal") {
    // weekly scale example (adjust if your real data max differs)
    yTicks = [0, 25000, 50000, 75000, 100000, 125000, 150000];
  } else {
    // Mensual
    yTicks = [0, 200000, 400000, 600000, 800000];
  }

  // X tick renderer: Diario -> odd numbers shown, even numbers shown as small dot (◦).
  const renderXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const val = Number(payload.value);
  const isLabel = (val % 2 !== 0 || val === 30) && val !== 29; // hide 29
  const dotChar = "◦";

  return (
    <g transform={`translate(${x},${y + 10})`} key={`tick-${val}`}>
      {isLabel ? (
        <text
          x={0}
          y={0}
          textAnchor="middle"
          fill="#6f7276"
          fontSize={10}
          fontFamily="Poppins, sans-serif"
        >
          {val}
        </text>
      ) : (
        <text
          x={0}
          y={0}
          textAnchor="middle"
          fill="#bdbdbd"
          fontSize={10}
          fontFamily="Poppins, sans-serif"
        >
          {dotChar}
        </text>
      )}
    </g>
  );
};


  // Weekly tick renderer (S1..)
  const renderWeeklyTick = (props: any) => {
    const { x, y, payload } = props;
    const val = Number(payload.value);
    return (
      <g transform={`translate(${x},${y + 10})`} key={`wk-${val}`}>
        <text
          x={0}
          y={0}
          textAnchor="middle"
          fill="#6f7276"
          fontSize={10}
          fontFamily="Poppins, sans-serif"
        >
          {`S${val}`}
        </text>
      </g>
    );
  };

  // Monthly tick renderer (Ene..Dic)
  const renderMonthlyTick = (props: any) => {
    const { x, y, payload } = props;
    const idx = Number(payload.value) - 1;
    const label = MONTH_LABELS[idx] ?? payload.value;
    return (
      <g transform={`translate(${x},${y + 10})`} key={`mo-${payload.value}`}>
        <text
          x={0}
          y={0}
          textAnchor="middle"
          fill="#6f7276"
          fontSize={10}
          fontFamily="Poppins, sans-serif"
        >
          {label}
        </text>
      </g>
    );
  };

  // compute X axis props to ensure the area touches the left & right edges.
  // We set type="number" and domain to the start/end of xTicks.
  const xDomain =
    timePeriod === "Diario" ? [1, 30] : timePeriod === "Semanal" ? [1, 12] : [1, 12];

  return (
    <div className="w-full lg:col-start-1 lg:col-end-2">
      <div className="w-full flex justify-start mb-[12px]">
        <div className="max-w-[760px] w-full">
          <h2 className="font-['Poppins-SemiBold'] font-semibold text-[#222222] text-[16px] sm:text-[18px] md:text-[20px] mb-[6px]">
            Rendimiento de transacciones
          </h2>
          <div className="flex items-center gap-[7px]">
            <Calendar className="w-[13px] h-[13px] sm:w-[14px] sm:h-[14px] text-[#6f7276]" />
            <p className="font-['Poppins-Regular'] text-[#6f7276] text-[10px] sm:text-[11px] md:text-[12px] leading-[18px]">
              {timePeriod === "Diario"
                ? `Tabla diario de los últimos 30 días`
                : timePeriod === "Semanal"
                ? `Tabla semanal de los últimos 3 meses`
                : `Tabla mensual de los últimos 12 meses`}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-[240px] sm:h-[260px] md:h-[300px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            // to make area touch both edges, set domain and small margins
            margin={{ top: 10, right: 12, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4B4BBB" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#4B4BBB" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            {/* Grid: vertical true -> draws vertical lines at every tick in X */}
            <CartesianGrid strokeDasharray="0" stroke="#dcdcdc" vertical={true} horizontal={true} />

            <XAxis
              dataKey="day"
              type="number"
              domain={xDomain}
              ticks={xTicks}
              axisLine={false}
              tickLine={false}
              padding={{ left: 0, right: 0 }}
              interval={0}
              // custom tick renderer depending on period
              tick={timePeriod === "Diario" ? renderXAxisTick : timePeriod === "Semanal" ? renderWeeklyTick : renderMonthlyTick}
            />

            <YAxis
              tick={{ fontSize: 10, fill: "#6f7276" }}
              axisLine={false}
              tickLine={false}
              ticks={yTicks}
              tickFormatter={(v: number) => {
                // show "0" as "0k"
                if (v === 0) return "0k";
                // format thousands with k
                if (v >= 1000) return `${Math.round(v / 1000)}k`;
                return String(v);
              }}
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
              dot={{ r: 2, fill: "#4B4BBB", strokeWidth: 1 }}
              activeDot={{ r: 4, stroke: "#4B4BBB", strokeWidth: 1 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartSection;
