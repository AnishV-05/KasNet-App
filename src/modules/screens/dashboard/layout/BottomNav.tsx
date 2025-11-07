import type { LucideIcon } from "lucide-react";
import { Home, ArrowLeftRight, QrCode, Percent, LayoutDashboard } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const defaultItems: NavItem[] = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "transacciones", label: "Transacciones", icon: ArrowLeftRight },
  { id: "qr", label: "Mi QR", icon: QrCode },
  { id: "tarifario", label: "Tarifario", icon: Percent },
  { id: "rendimiento", label: "Rendimiento", icon: LayoutDashboard },
];

interface BottomNavProps {
  items?: NavItem[];
  active?: string;
  onChange?: (id: string) => void;
}

/**
 * Mobile bottom nav.
 * Visible on small screens only (lg:hidden).
 * Uses safe-area-inset bottom padding to avoid home-indicator overlap.
 */
export function BottomNav({ items = defaultItems, active, onChange }: BottomNavProps) {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#e9e9ee] shadow-[0_-4px_12px_rgba(0,0,0,0.04)]"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)", // iOS home indicator safe area
      }}
      aria-label="Bottom navigation"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between gap-2 h-[64px]">
          {items.map((it) => {
            const Icon = it.icon;
            const isActive = it.id === active;
            return (
              <button
                key={it.id}
                onClick={() => onChange?.(it.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 transition-colors duration-150 rounded-md ${
                  isActive ? "text-[#4B4BBB]" : "text-[#6f7276] hover:text-[#4B4BBB]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#4B4BBB]" : ""}`} />
                <span className="text-[11px] leading-[14px] mt-1">{it.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default BottomNav;
