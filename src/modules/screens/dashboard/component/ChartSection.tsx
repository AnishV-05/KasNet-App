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

/* ------------ X ticks (unchanged) ------------ */
function getDailyXTicks()  { return Array.from({ length: 30 }, (_, i) => i + 1); }
function getWeeklyXTicks() { return Array.from({ length: 12 }, (_, i) => i + 1); }
function getMonthlyXTicks(){ return Array.from({ length: 12 }, (_, i) => i + 1); }

/* ------------ Nice number helpers for Y scale ------------ */
function niceNumber(range: number, round: boolean) {
  // classic "nice numbers" (1, 2, 2.5, 5, 10) scaling
  const exponent = Math.floor(Math.log10(range || 1));
  const fraction  = range / Math.pow(10, exponent);
  let niceFraction: number;

  if (round) {
    if (fraction < 1.5)       niceFraction = 1;
    else if (fraction < 2.25) niceFraction = 2;
    else if (fraction < 3.5)  niceFraction = 2.5;
    else if (fraction < 7.5)  niceFraction = 5;
    else                      niceFraction = 10;
  } else {
    if (fraction <= 1)        niceFraction = 1;
    else if (fraction <= 2)   niceFraction = 2;
    else if (fraction <= 2.5) niceFraction = 2.5;
    else if (fraction <= 5)   niceFraction = 5;
    else                      niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
}

function buildDynamicTicks(maxVal: number, desiredTicks = 6): number[] {
  // Guard: all zeros
  if (!(maxVal > 0)) return [0, 1]; // minimal range to avoid flat axis warning

  const n = Math.max(2, desiredTicks);
  // Step size
  const step = niceNumber(maxVal / (n - 1), true);
  // Extend to a nice maximum
  const niceMax = niceNumber(step * (n - 1), false);

  const ticks: number[] = [];
  for (let v = 0; v <= niceMax + 1e-9; v += step) ticks.push(Math.round(v));
  // Ensure 0 present
  if (ticks[0] !== 0) ticks.unshift(0);
  return ticks;
}

export function ChartSection({ timePeriod, chartData }: ChartSectionProps) {
  /* ------------ X axis ------------ */
  const xTicks =
    timePeriod === "Diario"
      ? getDailyXTicks()
      : timePeriod === "Semanal"
      ? getWeeklyXTicks()
      : getMonthlyXTicks();

  const xDomain = timePeriod === "Diario" ? [1, 30] : [1, 12];

  /* ------------ Dynamic Y ticks ------------ */
  const maxValue = chartData.reduce((m, d) => Math.max(m, d.value || 0), 0);

  // Choose a sensible tick density per period
  const desiredTickCount =
    timePeriod === "Diario" ? 6 : timePeriod === "Semanal" ? 6 : 6;

  const yTicks = buildDynamicTicks(maxValue, desiredTickCount);

  /* ------------ Custom X tick renderers (unchanged) ------------ */
  const renderXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const val = Number(payload.value);
    const isLabel = (val % 2 !== 0 || val === 30) && val !== 29; // hide 29
    const dotChar = "◦";

    return (
      <g transform={`translate(${x},${y + 10})`} key={`tick-${val}`}>
        {isLabel ? (
          <text x={0} y={0} textAnchor="middle" fill="#6f7276" fontSize={10} fontFamily="Poppins, sans-serif">
            {val}
          </text>
        ) : (
          <text x={0} y={0} textAnchor="middle" fill="#bdbdbd" fontSize={10} fontFamily="Poppins, sans-serif">
            {dotChar}
          </text>
        )}
      </g>
    );
  };

  const renderWeeklyTick = (props: any) => {
    const { x, y, payload } = props;
    const val = Number(payload.value);
    return (
      <g transform={`translate(${x},${y + 10})`} key={`wk-${val}`}>
        <text x={0} y={0} textAnchor="middle" fill="#6f7276" fontSize={10} fontFamily="Poppins, sans-serif">
          {`S${val}`}
        </text>
      </g>
    );
  };

  const renderMonthlyTick = (props: any) => {
    const { x, y, payload } = props;
    const idx = Number(payload.value) - 1;
    const label = MONTH_LABELS[idx] ?? payload.value;
    return (
      <g transform={`translate(${x},${y + 10})`} key={`mo-${payload.value}`}>
        <text x={0} y={0} textAnchor="middle" fill="#6f7276" fontSize={10} fontFamily="Poppins, sans-serif">
          {label}
        </text>
      </g>
    );
  };

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
          <AreaChart data={chartData} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4B4BBB" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#4B4BBB" stopOpacity={0.05} />
              </linearGradient>
            </defs>

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
              tick={
                timePeriod === "Diario"
                  ? renderXAxisTick
                  : timePeriod === "Semanal"
                  ? renderWeeklyTick
                  : renderMonthlyTick
              }
            />

            <YAxis
              ticks={yTicks}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6f7276" }}
              tickFormatter={(v: number) => {
                if (v === 0) return "0k";
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
              formatter={(value: number) => [`${Number(value).toLocaleString()} trxs`, "Transacciones"]}
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
