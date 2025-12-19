// src/modules/screens/dashboard/dashboard.screen.tsx
import "@/assets/styles/app.scss";
import { useMemo, useState } from "react";
import { DesktopHeader } from "./layout/DesktopHeader";
import { DesktopSidebar } from "./layout/DesktopSidebar";
import { MobileHeader } from "./layout/MobileHeader";
import BottomNav from "./layout/BottomNav";
import { TimePeriodTabs } from "./component/TimePeriodTabs";
import { SummaryCards } from "./component/SummaryCards";
import { ChartSection } from "./component/ChartSection";
import { RecommendationsSection } from "./component/RecommendationsSection";
import {
  useGetSummaryQuery,
  useGetTimeseriesQuery,
  useGetGroupByQuery,
  useGetTerminalsQuery,
} from "@/modules/redux/api/externalBffApi.empty-api";
import { skipToken } from "@reduxjs/toolkit/query";

type TimePeriod = "Diario" | "Semanal" | "Mensual";
type TransactionType = "Canal" | "Operación" | "Entidad";

type DashboardScreenProps = {
  terminalId?: string; // from Kasnet parent if available
 // agentName?: string;
 // timeZone?: string;
};

export function DashboardScreen({ terminalId }: DashboardScreenProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("Diario");
  const [transactionType, setTransactionType] = useState<TransactionType>("Canal");
  const [activeMenu, setActiveMenu] = useState("rendimiento");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ---- terminals fallback (Option C) ----
  const { data: terminals } = useGetTerminalsQuery();

  // terminals API returns a flat array of IDs (numbers), so grab the first one
  const fallbackTerminalId = useMemo(() => {
    if (!terminals?.length) return undefined;
    return String(terminals[10]);
  }, [terminals]);

  const testTerminalId = "37184201"; 

  // final terminal used for all analytics calls:
  // 1) prefer parent terminalId
  // 2) otherwise use first from /analytics/terminals
  const effectiveTerminalId = testTerminalId || terminalId || fallbackTerminalId;
  const hasTerminal = !!effectiveTerminalId;

  // ---- date ranges by tab ----
  const fmtStart = (d: Date) =>
  `${d.toISOString().split("T")[0]} 00:00:00`;
  const fmtEnd = (d: Date) => 
  `${d.toISOString().split("T")[0]} 00:00:00`;

  const today = new Date();
  const daysAgo = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d;
  };
  const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
  const monthsAgoStart = (n: number) => {
    const d = startOfMonth(today);
    d.setMonth(d.getMonth() - n);
    return d;
  };

  const ranges: Record<TimePeriod, { start: string; end: string }> = {
    Diario: { start: fmtStart(daysAgo(31)), end: fmtEnd(today) }, // ~31 días
    Semanal: { start: fmtStart(daysAgo(83)), end: fmtEnd(today) }, // ~12 semanas
    Mensual: { start: fmtStart(monthsAgoStart(11)), end: fmtEnd(today) }, // 12 meses
  };

  const { start, end } = ranges[timePeriod];

  const dimMap: Record<TransactionType, "channel" | "operation" | "entity"> = {
    Canal: "channel",
    Operación: "operation",
    Entidad: "entity",
  };

  // ---- API calls ----
  const { data: apiSummary, isFetching: loadingSummary } = useGetSummaryQuery(
    hasTerminal ? { terminal_id: effectiveTerminalId!, start, end } : skipToken
  );

  const { data: apiSeries, isFetching: loadingSeries } = useGetTimeseriesQuery(
    hasTerminal ? { terminal_id: effectiveTerminalId!, start, end } : skipToken
  );

  const { data: apiGroup, isFetching: loadingGroup } = useGetGroupByQuery(
    hasTerminal
      ? { terminal_id: effectiveTerminalId!, dimension: dimMap[transactionType], start, end }
      : skipToken
  );

  // ---- helpers ----
  const toAmPm = (h: number) => {
    const hr = h % 24;
    const hh = hr % 12 || 12;
    return `${hh}:00 ${hr >= 12 ? "pm" : "am"}`;
  };
  const parse = (s: string) => new Date(s + "T00:00:00");

  // color utils
  const BRAND_COLORS = ["#4B4BBB", "#F9CB00", "#AAB5FF"]; // keep originals for top 3
  const EXTRA_COLORS = [
    "#2BBBD8",
    "#FF6B6B",
    "#2ECC71",
    "#FF9F43",
    "#F368E0",
    "#5C7CFA",
    "#A3E635",
    "#22D3EE",
    "#64748B",
    "#8B5CF6",
  ];
  const wheelColor = (i: number) => `hsl(${(i * 47) % 360} 70% 52%)`;
  const luminance = (hex: string) => {
    const c = hex.replace("#", "");
    const r = parseInt(c.slice(0, 2), 16) / 255;
    const g = parseInt(c.slice(2, 4), 16) / 255;
    const b = parseInt(c.slice(4, 6), 16) / 255;
    const f = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const bestText = (hex: string) => (luminance(hex) > 0.55 ? "#1f2937" : "#ffffff");

  // Aggregate daily points → weekly/monthly buckets (UI expects 12 buckets for S/M)
  const aggregateSeries = (
    series: { date: string; transactions: number }[],
    mode: TimePeriod,
    rangeStart: string
  ) => {
    if (!series?.length) return [];
    const startMs = parse(rangeStart).getTime();
    const day = 86400000;

    if (mode === "Semanal") {
      const map = new Map<number, number>();
      for (const p of series) {
        const idx = Math.floor((parse(p.date).getTime() - startMs) / (7 * day));
        map.set(idx, (map.get(idx) || 0) + (p.transactions || 0));
      }
      const keys = Array.from(map.keys()).sort((a, b) => a - b);
      return keys.map((_, i) => ({ day: i + 1, value: map.get(keys[i])! }));
    }

    if (mode === "Mensual") {
      const map = new Map<string, number>();
      for (const p of series) {
        const d = parse(p.date);
        const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
        map.set(key, (map.get(key) || 0) + (p.transactions || 0));
      }
      const keys = Array.from(map.keys()).sort();
      return keys.map((k, i) => ({ day: i + 1, value: map.get(k)! }));
    }

    // Diario → passthrough
    return series.map((p, i) => ({ day: i + 1, value: p.transactions || 0 }));
  };

  // ---- SUMMARY (backend; placeholder while loading) ----
  const summary = useMemo(() => {
    if (!apiSummary) {
      return {
        totalTransactions: { value: loadingSummary ? "…" : "…", change: 0, isPositive: true },
        favoriteOperation: { value: loadingSummary ? "…" : "…", change: 0, isPositive: true },
        peakHour: { value: loadingSummary ? "…" : "…", change: 0, isPositive: true },
      };
    }
    return {
      totalTransactions: {
        value: (apiSummary.total_transactions?.value ?? 0).toLocaleString("en-US"),
        change: apiSummary.total_transactions?.growth ?? 0,
        isPositive: (apiSummary.total_transactions?.growth ?? 0) >= 0,
      },
      favoriteOperation: {
        value: apiSummary.favorite_operation ?? "-",
        change: apiSummary.peak_hour?.growth ?? 0,
        isPositive: (apiSummary.peak_hour?.growth ?? 0) >= 0,
      },
      peakHour: {
        value:
          typeof apiSummary.peak_hour?.value === "number"
            ? toAmPm(apiSummary.peak_hour.value)
            : "-",
        change: 0,
        isPositive: true,
      },
    };
  }, [apiSummary, loadingSummary]);

  // ---- CHART (backend; empty array while loading) ----
  const chartData = useMemo(() => {
    if (!apiSeries?.length) return [];

    const normalized = apiSeries.map((s) => ({
      date: s.date,
      transactions: Number(s.transactions ?? 0), // ✅ force number
    }));

    return aggregateSeries(normalized, timePeriod, start);
  }, [apiSeries, timePeriod, start]);

  // ---- DONUT/LIST (brand colors for top 3, auto-generate beyond) ----
  const transactionData = useMemo(() => {
    if (!apiGroup?.length) return { total: 0, items: [] as any[] };

    // force numeric values (API returns strings)
    const total = apiGroup.reduce(
      (a, r) => a + Number(r.transactions ?? 0),
      0
    );

    const items = [...apiGroup]
      .sort((a, b) => Number(b.transactions ?? 0) - Number(a.transactions ?? 0))
      .map((row, idx) => {
        const tx = Number(row.transactions ?? 0);
        const amount = Number(row.total_amount ?? 0);

        let colorHex: string;
        if (idx < BRAND_COLORS.length) {
          colorHex = BRAND_COLORS[idx];
        } else {
          const extraIndex = idx - BRAND_COLORS.length;
          colorHex = EXTRA_COLORS[extraIndex] ?? wheelColor(extraIndex);
        }

        return {
          name: row.channel || row.operation || row.entity || `Item ${idx + 1}`,
          colorHex,
          textHex: bestText(colorHex),
          transactions: tx,
          amount,
          percentage: total ? Math.round((tx / total) * 100) : 0,
        };
      });

    // ensure rounding sums to 100
    const sum = items.reduce((a, i) => a + (i.percentage || 0), 0);
    if (items.length && sum !== 100) {
      items[items.length - 1].percentage += 100 - sum;
    }

    return { total, items };
  }, [apiGroup]);


  return (
    <div className="bg-white relative w-full min-h-screen flex flex-col lg:max-w-none mx-auto overflow-x-hidden overflow-y-hidden">
      {/* Headers */}
      <div className="hidden lg:block sticky top-0 z-20">
        <DesktopHeader />
      </div>
      <div className="lg:hidden sticky top-0 z-20">
        <MobileHeader />
      </div>

      <BottomNav active={activeMenu} onChange={(id) => setActiveMenu(id)} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <DesktopSidebar
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        <div className="flex h-screen w-full min-w-0">
          {/* Main Content Area */}
          <div
            className="
              flex-1 overflow-y-auto min-w-0
              pb-[calc(64px+env(safe-area-inset-bottom))]
              sm:pb-[calc(114px+env(safe-area-inset-bottom))]
            "
          >
            <div
              className={`w-full max-w-[1440px] mx-auto px-[12px] sm:px-[20px] md:px-[24px] lg:px-[40px] py-[16px] sm:py-[20px] lg:py-[32px] pb-[100px] lg:pb-[0px] flex flex-col lg:grid lg:gap-[40px] lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)]`}
            >
              {/* Left column */}
              <div className="flex flex-col">
                {/* <div className="order-1 lg:order-4 mt-[8px] sm:mt-[8px] mb-[32px] sm:mb-[0px] w-full">
                  <RecommendationsSection />
                </div> */}

                <div className="order-2 lg:order-1 flex flex-col gap-[12px] mb-[20px] sm:mb-[32px]">
                  <h1 className="font-['Poppins-SemiBold'] text-[#444444] text-[16px] sm:text-[18px] md:text-[20px] leading-tight">
                    Resumen general
                  </h1>
                  <div className="flex flex-wrap gap-[8px] sm:gap-[12px] md:gap-[16px]">
                    <TimePeriodTabs timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
                  </div>
                </div>

                <div className="order-3 lg:order-2 mb-[24px] sm:mb-[32px] w-full">
                  <div className="flex flex-wrap justify-center sm:justify-start gap-[12px] sm:gap-[16px] md:gap-[20px]">
                    <SummaryCards
                      totalTransactions={summary.totalTransactions}
                      favoriteOperation={summary.favoriteOperation}
                      peakHour={summary.peakHour}
                    />
                  </div>
                </div>

                <div className="order-4 lg:order-3 mb-[10px] sm:mb-[0px] w-full overflow-x-auto min-w-0">
                  <ChartSection timePeriod={timePeriod} chartData={chartData} isFetching={loadingSeries} />
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden lg:block lg:col-start-2 lg:row-start-1 lg:row-end-[-1] w-[2px] bg-[#efefef] h-[calc(100%+64px)] -my-[32px]" />

              {/* Right column */}
              <div className="lg:col-start-3 lg:col-end-4 ">
                <div className="mb-[8px]">
                  <p className="font-['Poppins-SemiBold'] text-[#444444] text-[16px] sm:text-[18px] md:text-[20px] mb-[12px]">
                    Detalle de transacciones
                  </p>

                  <div className="flex justify-between items-end border-b border-[#efefef] overflow-x-auto no-scrollbar">
                    {(["Canal", "Operación", "Entidad"] as TransactionType[]).map((type) => {
                      const isActive = transactionType === type;
                      return (
                        <div
                          key={type}
                          className="flex-1 flex flex-col items-center relative min-w-[100px]"
                        >
                          <button
                            onClick={() => setTransactionType(type)}
                            className={`w-full text-center px-[14px] py-[8px] text-[13px] sm:text-[16px] leading-[18px] transition-all duration-150 rounded-t-[1px]
                              ${
                                isActive
                                  ? "bg-[#f5f4ff] text-[#444444] font-['Poppins-SemiBold'] shadow-sm"
                                  : "bg-transparent text-[#6f7276] hover:text-[#4B4BBB] font-['Poppins-SemiBold']"
                              }`}
                          >
                            {type}
                          </button>
                          <div
                            className={`absolute bottom-[-1px] h-[3px] rounded-full transition-all duration-200 ${
                              isActive ? "bg-[#4B4BBB]" : "bg-transparent"
                            }`}
                            style={{ left: "14px", right: "14px" }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="flex flex-col items-center lg:items-stretch gap-[20px] sm:gap-[24px] w-full">
                  {/* Donut */}
                  <div className="w-full flex items-center justify-center mb-[8px] mt-[20px] sm:mt-[24px]">
                    {loadingGroup ? (
                      // ---- SKELETON while loading ----
                      <div className="relative w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px]">
                        <div className="w-full h-full rounded-full bg-[#f2f2f2] animate-pulse" />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                          <div className="h-3 w-16 bg-[#e9e9e9] rounded mb-2 animate-pulse" />
                          <div className="h-4 w-24 bg-[#e9e9e9] rounded animate-pulse" />
                        </div>
                      </div>
                    ) : (
                      // ---- REAL DONUT ----
                      <div className="relative w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px]">
                        <svg viewBox="0 0 208 208" className="w-full h-full">
                          <g>
                            {(() => {
                              const innerRadius = 85;
                              const outerRadius = 100;
                              const rad = (a: number) => (a * Math.PI) / 180;

                              const items0 = (transactionData?.items ?? []).filter(
                                (i: any) => (i?.percentage ?? 0) > 0
                              );

                              if (!items0.length || (transactionData?.total ?? 0) === 0) {
                                return (
                                  <circle
                                    cx="104"
                                    cy="104"
                                    r={(innerRadius + outerRadius) / 2}
                                    fill="none"
                                    stroke="#efefef"
                                    strokeWidth={outerRadius - innerRadius}
                                  />
                                );
                              }

                              if (items0.length === 1) {
                                const c = items0[0];
                                return (
                                  <circle
                                    cx="104"
                                    cy="104"
                                    r={(innerRadius + outerRadius) / 2}
                                    fill="none"
                                    stroke={c.colorHex}
                                    strokeWidth={outerRadius - innerRadius}
                                  />
                                );
                              }

                              let current = -90; // start at top
                              return items0.map((item: any, idx: number) => {
                                const end = current + (item.percentage / 100) * 360;
                                const x1 = 104 + innerRadius * Math.cos(rad(current));
                                const y1 = 104 + innerRadius * Math.sin(rad(current));
                                const x2 = 104 + outerRadius * Math.cos(rad(current));
                                const y2 = 104 + outerRadius * Math.sin(rad(current));
                                const x3 = 104 + outerRadius * Math.cos(rad(end));
                                const y3 = 104 + outerRadius * Math.sin(rad(end));
                                const x4 = 104 + innerRadius * Math.cos(rad(end));
                                const y4 = 104 + innerRadius * Math.sin(rad(end));
                                const largeArc = item.percentage > 50 ? 1 : 0;

                                const path = (
                                  <path
                                    key={`${item.name}-${idx}`}
                                    d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}`}
                                    fill={item.colorHex}
                                  />
                                );
                                current = end;
                                return path;
                              });
                            })()}
                          </g>
                        </svg>

                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
                          <p className="font-['Poppins-Regular'] text-[#444] text-[13px] leading-[18px]">
                            Total:
                          </p>
                          <p className="font-['Poppins-SemiBold'] text-[#444] text-[15px] leading-[22px]">
                            {transactionData?.total ?? 0} trxs.
                          </p>
                          {(transactionData?.items?.length ?? 0) === 0 && (
                            <span className="mt-[4px] text-[12px] text-[#6f7276]">Sin datos</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* List */}
                  <div className="w-full flex-1">
                    {loadingGroup ? (
                      // ---------- Skeleton List While Loading ----------
                      <div className="flex flex-col gap-[6px] px-[10px]">
                        {[1, 2, 3, 4].map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-[10px] border-b border-[#efefef] animate-pulse"
                          >
                            <div className="flex items-center gap-[10px]">
                              <div className="w-[56px] h-[28px] rounded-[20px] bg-[#e9e9e9]" />
                            </div>
                            <div className="text-right">
                              <div className="h-[14px] w-[60px] bg-[#e9e9e9] rounded mb-[4px]" />
                              <div className="h-[12px] w-[50px] bg-[#e9e9e9] rounded" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // ---------- Actual Data ----------
                      <div className="box-border flex flex-col gap-[6px]">
                        {transactionData.items.length === 0 && (
                          <div className="px-[10px] py-[12px] text-[#6f7276] text-[13px]">
                            Sin datos.
                          </div>
                        )}

                        {transactionData.items.map((item: any, idx: number) => (
                          <div
                            key={`${item.name}-${idx}`}
                            className={`flex items-center justify-between px-[10px] sm:px-[12px] py-[8px] sm:py-[10px] rounded-[10px] ${
                              idx !== transactionData.items.length - 1
                                ? "border-b border-[#efefef]"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-[10px] sm:gap-[12px]">
                              <div
                                className="flex items-center justify-center min-w-[50px] sm:min-w-[56px] px-[10px] py-[6px] rounded-[20px]"
                                style={{ backgroundColor: item.colorHex }}
                              >
                                <p
                                  className="font-['Poppins-Medium'] text-[13px] sm:text-[14px]"
                                  style={{ color: item.textHex }}
                                >
                                  {item.name}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-['Poppins-SemiBold'] text-[#444] text-[13px] sm:text-[14px]">
                                {item.transactions} trxs.
                              </p>
                              <p className="text-[#444] font-['Poppins-Regular'] text-[12px]">
                                S/. {Number(item.amount ?? 0).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* /Right column */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardScreen;
