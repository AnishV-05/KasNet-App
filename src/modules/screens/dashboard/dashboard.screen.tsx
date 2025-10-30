import "@/assets/styles/app.scss";
import { useState } from "react";
import { Home, LayoutDashboard, ArrowLeftRight, QrCode, Percent } from "lucide-react";
import { DesktopHeader } from "./layout/DesktopHeader";
import { DesktopSidebar } from "./layout/DesktopSidebar";
import { MobileHeader } from "./layout/MobileHeader";
import { TimePeriodTabs } from "./component/TimePeriodTabs";
import { SummaryCards } from "./component/SummaryCards";
import { ChartSection } from "./component/ChartSection";
import { RecommendationsSection } from "./component/RecommendationsSection";

type TimePeriod = "Diario" | "Semanal" | "Mensual";
type TransactionType = "Canal" | "Operación" | "Entidad";

const mockData = {
  Diario: {
    summary: {
      totalTransactions: { value: "333,559", change: 12.5, isPositive: true },
      favoriteOperation: { value: "Sedapal", change: 12.5, isPositive: true },
      peakHour: { value: "5:00 pm", change: 12.5, isPositive: true },
    },
    chartData: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      value: Math.floor(Math.random() * 25000) + 5000,
    })),
  },
  Semanal: {
    summary: {
      totalTransactions: { value: "2,234,913", change: 18.3, isPositive: true },
      favoriteOperation: { value: "Recarga Movistar", change: 8.7, isPositive: true },
      peakHour: { value: "6:00 pm", change: 15.2, isPositive: true },
    },
    chartData: Array.from({ length: 12 }, (_, i) => ({
      day: i + 1,
      value: Math.floor(Math.random() * 150000) + 50000,
    })),
  },
  Mensual: {
    summary: {
      totalTransactions: { value: "9,876,543", change: 25.4, isPositive: true },
      favoriteOperation: { value: "Pago de Servicios", change: 20.1, isPositive: true },
      peakHour: { value: "7:00 pm", change: 18.9, isPositive: true },
    },
    chartData: Array.from({ length: 12 }, (_, i) => ({
      day: i + 1,
      value: Math.floor(Math.random() * 800000) + 200000,
    })),
  },
};

const mockTransactionData = {
  Canal: {
    Diario: {
      total: 1209,
      items: [
        { name: "App", color: "bg-[#4b4bbb]", textColor: "text-white", transactions: 55, amount: 662.35, percentage: 45 },
        { name: "POS", color: "bg-[#f9cb00]", textColor: "text-[#714b04]", transactions: 45, amount: 356.65, percentage: 37 },
        { name: "Web", color: "bg-[#aab5ff]", textColor: "text-white", transactions: 30, amount: 190.0, percentage: 18 },
      ],
    },
    Semanal: {
      total: 8463,
      items: [
        { name: "App", color: "bg-[#4b4bbb]", textColor: "text-white", transactions: 385, amount: 4638.45, percentage: 48 },
        { name: "POS", color: "bg-[#f9cb00]", textColor: "text-[#714b04]", transactions: 315, amount: 2496.55, percentage: 35 },
        { name: "Web", color: "bg-[#aab5ff]", textColor: "text-white", transactions: 210, amount: 1328.0, percentage: 17 },
      ],
    },
    Mensual: {
      total: 36475,
      items: [
        { name: "App", color: "bg-[#4b4bbb]", textColor: "text-white", transactions: 1659, amount: 19998.25, percentage: 50 },
        { name: "POS", color: "bg-[#f9cb00]", textColor: "text-[#714b04]", transactions: 1354, amount: 10761.75, percentage: 32 },
        { name: "Web", color: "bg-[#aab5ff]", textColor: "text-white", transactions: 905, amount: 5715.0, percentage: 18 },
      ],
    },
  },
  Operación: {
    Diario: {
      total: 1209,
      items: [
        { name: "Sedapal", color: "bg-[#4b4bbb]", textColor: "text-white", transactions: 65, amount: 780.0, percentage: 50 },
        { name: "Movistar", color: "bg-[#f9cb00]", textColor: "text-[#714b04]", transactions: 48, amount: 576.0, percentage: 30 },
        { name: "Claro", color: "bg-[#aab5ff]", textColor: "text-white", transactions: 35, amount: 420.0, percentage: 20 },
      ],
    },
    Semanal: {
      total: 8463,
      items: [
        { name: "Sedapal", color: "bg-[#4b4bbb]", textColor: "text-white", transactions: 455, amount: 5460.0, percentage: 52 },
        { name: "Movistar", color: "bg-[#f9cb00]", textColor: "text-[#714b04]", transactions: 336, amount: 4032.0, percentage: 28 },
        { name: "Claro", color: "bg-[#aab5ff]", textColor: "text-white", transactions: 245, amount: 2940.0, percentage: 20 },
      ],
    },
    Mensual: {
      total: 36475,
      items: [
        { name: "Sedapal", color: "bg-[#4b4bbb]", textColor: "text-white", transactions: 1962, amount: 23544.0, percentage: 55 },
        { name: "Movistar", color: "bg-[#f9cb00]", textColor: "text-[#714b04]", transactions: 1447, amount: 17364.0, percentage: 25 },
        { name: "Claro", color: "bg-[#aab5ff]", textColor: "text-white", transactions: 1095, amount: 13140.0, percentage: 20 },
      ],
    },
  },
  Entidad: {
    Diario: {
      total: 1209,
      items: [
        { name: "BCP", color: "bg-[#4b4bbb]", textColor: "text-white", transactions: 70, amount: 840.0, percentage: 55 },
        { name: "Interbank", color: "bg-[#f9cb00]", textColor: "text-[#714b04]", transactions: 42, amount: 504.0, percentage: 28 },
        { name: "BBVA", color: "bg-[#aab5ff]", textColor: "text-white", transactions: 28, amount: 336.0, percentage: 17 },
      ],
    },
    Semanal: {
      total: 8463,
      items: [
        { name: "BCP", color: "bg-[#4b4bbb]", textColor: "text-white", transactions: 490, amount: 5880.0, percentage: 58 },
        { name: "Interbank", color: "bg-[#f9cb00]", textColor: "text-[#714b04]", transactions: 294, amount: 3528.0, percentage: 25 },
        { name: "BBVA", color: "bg-[#aab5ff]", textColor: "text-white", transactions: 196, amount: 2352.0, percentage: 17 },
      ],
    },
    Mensual: {
      total: 36475,
      items: [
        { name: "BCP", color: "bg-[#4b4bbb]", textColor: "text-white", transactions: 2116, amount: 25392.0, percentage: 60 },
        { name: "Interbank", color: "bg-[#f9cb00]", textColor: "text-[#714b04]", transactions: 1268, amount: 15216.0, percentage: 22 },
        { name: "BBVA", color: "bg-[#aab5ff]", textColor: "text-white", transactions: 844, amount: 10128.0, percentage: 18 },
      ],
    },
  },
};

const bottomNavItems = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "transacciones", label: "Transacciones", icon: ArrowLeftRight },
  { id: "qr", label: "Mi QR", icon: QrCode },
  { id: "tarifario", label: "Tarifario", icon: Percent },
  { id: "rendimiento", label: "Rendimiento", icon: LayoutDashboard },
];

export function DashboardScreen() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("Diario");
  const [transactionType, setTransactionType] = useState<TransactionType>("Canal");
  const [activeMenu, setActiveMenu] = useState("rendimiento");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const data = mockData[timePeriod];
  const transactionData = mockTransactionData[transactionType][timePeriod];

  const transactionTypes: TransactionType[] = ["Canal", "Operación", "Entidad"];

  // Helper to convert color class to hex for donut chart
  const getColorHex = (colorClass: string) => {
    if (colorClass.includes("4b4bbb")) return "#4B4BBB";
    if (colorClass.includes("f9cb00")) return "#F9CB00";
    return "#AAB5FF";
  };

 return (
  <div className="bg-white relative w-full min-h-screen flex flex-col lg:max-w-none mx-auto overflow-x-hidden overflow-y-hidden">
    {/* Headers */}
    <div className="hidden lg:block sticky top-0 z-20">
      <DesktopHeader />
    </div>
    <div className="lg:hidden sticky top-0 z-20">
      <MobileHeader />
    </div>

    {/* Main Content */}
    <div className="flex flex-1 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DesktopSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      <div className="flex h-screen w-full">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Responsive grid layout */}
          <div
            className={`w-full max-w-[1440px] mx-auto px-[12px] sm:px-[20px] md:px-[24px] lg:px-[40px] py-[16px] sm:py-[20px] lg:py-[32px] pb-[100px] lg:pb-[32px] flex flex-col lg:grid lg:gap-[48px] ${
              sidebarCollapsed
                ? "lg:grid-cols-[minmax(0,700px)_1px_500px]"
                : "lg:grid-cols-[minmax(0,1000px)_1px_500px]"
            }`}
          >
            {/* Left column */}
            <div className="flex flex-col">
              {/* Recommendation first on mobile/tablet, last on desktop */}
              <div className="order-1 lg:order-4 mt-[16px] sm:mt-[24px] mb-[32px] sm:mb-[48px] w-full">
                <RecommendationsSection />
              </div>

              {/* Summary Title + Tabs */}
              <div className="order-2 lg:order-1 flex flex-col gap-[12px] mb-[20px] sm:mb-[32px]">
                <h1 className="font-['Poppins-SemiBold'] text-[#444444] text-[16px] sm:text-[18px] md:text-[20px] leading-tight">
                  Resumen general
                </h1>
                <div className="flex flex-wrap gap-[8px] sm:gap-[12px] md:gap-[16px]">
                  <TimePeriodTabs timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
                </div>
              </div>

              {/* Summary Cards */}
              <div className="order-3 lg:order-2 mb-[24px] sm:mb-[32px] w-full">
                <div className="flex flex-wrap justify-center sm:justify-start gap-[12px] sm:gap-[16px] md:gap-[20px]">
                  <SummaryCards
                    totalTransactions={data.summary.totalTransactions}
                    favoriteOperation={data.summary.favoriteOperation}
                    peakHour={data.summary.peakHour}
                  />
                </div>
              </div>

              {/* Chart Section */}
              <div className="order-4 lg:order-3 mb-[32px] sm:mb-[48px] w-full overflow-x-auto">
                <ChartSection timePeriod={timePeriod} chartData={data.chartData} />
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block lg:col-start-2 lg:row-start-1 lg:row-end-[span_4] self-stretch lg:sticky lg:top-0 lg:-mt-[32px] lg:h-[calc(100vh+32px)] lg:w-[2px] bg-[#efefef] z-10"/>
            {/* Right column */}
            <div className="lg:col-start-3 lg:col-end-4 lg:pl-[24px]">
              <div className="mb-[8px]">
                <p className="font-['Poppins-SemiBold'] text-[#444444] text-[16px] sm:text-[18px] md:text-[20px] mb-[12px]">
                  Detalle de transacciones
                </p>

                {/* Transaction Tabs */}
                <div className="flex justify-between items-end border-b border-[#efefef] overflow-x-auto no-scrollbar">
                  {transactionTypes.map((type) => {
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
                          className={`absolute bottom-[-1px] h-[2px] w-[100px] sm:w-[128px] rounded-full transition-all duration-200 ${
                            isActive ? "bg-[#4B4BBB]" : "bg-transparent"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transaction Details */}
              <div className="flex flex-col items-center lg:items-stretch gap-[20px] sm:gap-[24px] w-full">
                {/* Pie Chart */}
                <div className="w-full flex items-center justify-center mb-[8px]">
                  <div className="relative w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px]">
                    <svg viewBox="0 0 208 208" className="w-full h-full">
                      <g>
                        {transactionData.items.map((item, index) => {
                          const innerRadius = 85;
                          const outerRadius = 100;
                          let startAngle = -90;
                          for (let i = 0; i < index; i++) {
                            startAngle +=
                              (transactionData.items[i].percentage / 100) * 360;
                          }
                          const endAngle =
                            startAngle + (item.percentage / 100) * 360;
                          const startRad = (startAngle * Math.PI) / 180;
                          const endRad = (endAngle * Math.PI) / 180;
                          const x1 = 104 + innerRadius * Math.cos(startRad);
                          const y1 = 104 + innerRadius * Math.sin(startRad);
                          const x2 = 104 + outerRadius * Math.cos(startRad);
                          const y2 = 104 + outerRadius * Math.sin(startRad);
                          const x3 = 104 + outerRadius * Math.cos(endRad);
                          const y3 = 104 + outerRadius * Math.sin(endRad);
                          const x4 = 104 + innerRadius * Math.cos(endRad);
                          const y4 = 104 + innerRadius * Math.sin(endRad);
                          const largeArc = item.percentage > 50 ? 1 : 0;
                          const color = getColorHex(item.color);
                          return (
                            <path
                              key={item.name}
                              d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}`}
                              fill={color}
                            />
                          );
                        })}
                      </g>
                    </svg>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
                      <p className="font-['Poppins-Regular'] text-[#444] text-[13px] leading-[18px]">
                        Total:
                      </p>
                      <p className="font-['Poppins-SemiBold'] text-[#444] text-[15px] leading-[22px]">
                        {transactionData.total} trxs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transaction List */}
                <div className="w-full flex-1">
                  <div className="box-border flex flex-col gap-[6px]">
                    {transactionData.items.map((item, idx) => (
                      <div
                        key={item.name}
                        className={`flex items-center justify-between px-[10px] sm:px-[12px] py-[8px] sm:py-[10px] rounded-[10px] ${
                          idx !== transactionData.items.length - 1
                            ? "border-b border-[#efefef]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-[10px] sm:gap-[12px]">
                          <div
                            className={`${item.color} flex items-center justify-center min-w-[50px] sm:min-w-[56px] px-[10px] py-[6px] rounded-[20px]`}
                          >
                            <p
                              className={`font-['Poppins-Medium'] text-[13px] sm:text-[14px] ${item.textColor}`}
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
                            S/. {item.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}

export default DashboardScreen;
