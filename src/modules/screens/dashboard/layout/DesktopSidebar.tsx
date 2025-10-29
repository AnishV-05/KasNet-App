import { useState } from "react";
import { 
  Home, 
  ArrowLeftRight, 
  QrCode, 
  Percent, 
  LayoutDashboard, 
  LogOut,
  ChevronsLeft
} from "lucide-react";

const menuItems = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "transacciones", label: "Transacciones", icon: ArrowLeftRight },
  { id: "qr", label: "Mi QR", icon: QrCode },
  { id: "tarifario", label: "Tarifario", icon: Percent },
  { id: "rendimiento", label: "Rendimiento", icon: LayoutDashboard },
];

interface DesktopSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function DesktopSidebar({ isCollapsed = false, onToggle }: DesktopSidebarProps) {
  const [activeMenu, setActiveMenu] = useState("rendimiento");

  return (
    <div className={`bg-white box-border flex flex-col gap-[16px] h-full pb-[24px] pl-[24px] pr-[32px] pt-[40px] relative rounded-br-[8px] rounded-tr-[8px] shadow-[0px_0px_4px_0px_rgba(68,68,68,0.25)] transition-all duration-300 ease-in-out ${
      isCollapsed ? 'min-w-[80px] max-w-[80px]' : 'min-w-[260px] max-w-[260px]'
    }`}>
      {/* Menu Items */}
      <div className="flex flex-col gap-[4px] items-start w-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`h-[48px] rounded-[8px] w-full transition-colors hover:bg-gray-100 ${
                isActive ? "bg-[#4b4bbb] hover:bg-[#4b4bbb]" : ""
              }`}
            >
              <div className={`box-border flex gap-[12px] h-[48px] items-center p-[12px] w-full ${
                isCollapsed ? 'justify-center' : ''
              }`}>
                <Icon 
                  className={`size-[24px] ${isActive ? 'text-white' : 'text-[#6f7276]'}`}
                />
                {!isCollapsed && (
                  <p
                    className={`font-['Poppins-Regular'] ${
                      isActive ? "font-semibold text-white" : "font-medium text-[#6f7276]"
                    } leading-[21px] text-[14px] whitespace-nowrap`}
                  >
                    {item.label}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Divider */}
      <div className="h-px bg-[#c8c8c8] w-full" />

      {/* Logout */}
      <div className="mt-auto w-full px-0 pb-4">
      <button className="h-[48px] rounded-[8px] w-full transition-colors hover:bg-gray-100 mb-[60px]">
        <div className={`box-border flex gap-[8px] h-[48px] items-center p-[12px] w-full ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          <LogOut className="size-[24px] text-[#6f7276]" />
          {!isCollapsed && (
            <p className="font-['Poppins-Regular'] font-medium leading-[21px] text-[#6f7276] text-[14px] whitespace-nowrap">
              Cerrar sesión
            </p>
          )}
        </div>
      </button>
      </div>

      {/* Collapse Button */}
      <button
        onClick={onToggle}
        className="absolute bg-[#4b4bbb] flex items-center justify-center right-[-18px] rounded-full top-[24px] size-[36px] hover:bg-[#5a5acb] transition-all duration-300 shadow-lg z-10"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronsLeft 
          className={`size-[20px] text-white transition-transform duration-300 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
}
