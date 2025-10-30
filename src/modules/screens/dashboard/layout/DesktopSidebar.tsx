import { useState } from "react";
import {
  Home,
  ArrowLeftRight,
  QrCode,
  Percent,
  LogOut,
  ChevronLeft,
  Gauge
} from "lucide-react";
 
const menuItems = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "transacciones", label: "Transacciones", icon: ArrowLeftRight },
  { id: "qr", label: "Mi QR", icon: QrCode },
  { id: "tarifario", label: "Tarifario", icon: Percent },
  { id: "rendimiento", label: "Rendimiento", icon: Gauge },
];
 
interface DesktopSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}
 
export function DesktopSidebar({ isCollapsed = false, onToggle }: DesktopSidebarProps) {
  const [activeMenu, setActiveMenu] = useState("rendimiento");
 
  return (
    <div
      className={`bg-white box-border flex flex-col gap-[16px] h-full pb-[24px] pt-[40px] relative rounded-br-[8px] rounded-tr-[8px] shadow-[0px_0px_4px_0px_rgba(68,68,68,0.25)] transition-all duration-300 ease-in-out
        ${
          isCollapsed
            ? 'min-w-[64px] max-w-[64px] '
            : 'min-w-[260px] max-w-[260px] pl-[24px] pr-[24px]'
        }`
      }
    >
      {/* Menu Items */}
      <div className="flex flex-col gap-[4px] items-start w-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`h-[48px] rounded-[8px] w-full transition-colors hover:bg-gray-100 flex items-center ${
                isActive ? "bg-[#4b4bbb] hover:bg-[#4b4bbb]" : ""
              }`}
            >
              <span className={`flex items-center justify-center ${isCollapsed ? "w-full" : "mr-3 ml-3"} h-[48px]`}>
                <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-[#6f7276]"}`} />
              </span>
              {!isCollapsed && (
                <span
                  className={`font-['Poppins-Regular'] ${
                    isActive ? "font-semibold text-white" : "font-medium text-[#6f7276]"
                  } leading-[21px] text-[14px] whitespace-nowrap`}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
 
      <div className="flex-1" />
 
      <div className="h-px bg-[#c8c8c8] w-full" />
 
      <div className="w-full pb-4">
        <button className="h-[48px] rounded-[8px] w-full transition-colors hover:bg-gray-100 mb-[60px] flex items-center">
          <span className={`flex items-center justify-center ${isCollapsed ? "w-full" : "mr-3"} h-[48px]`}>
            <LogOut className="w-6 h-6 text-[#6f7276]" />
          </span>
          {!isCollapsed && (
            <span className="font-['Poppins-Regular'] font-medium leading-[21px] text-[#6f7276] text-[14px] whitespace-nowrap">
              Cerrar sesión
            </span>
          )}
        </button>
      </div>
 
      <button
        onClick={onToggle}
        className="absolute bg-[#4b4bbb] flex items-center justify-center right-[-18px] rounded-full top-[24px] w-[36px] h-[36px] hover:bg-[#5a5acb] transition-all duration-300 shadow-lg z-10"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft
          className={`w-5 h-5 text-white transition-transform duration-300 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
}
 
 
