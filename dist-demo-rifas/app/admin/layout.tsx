"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Logo from "@/components/Logo";
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  CheckSquare, 
  Settings, 
  MessageSquare, 
  CreditCard, 
  FileText, 
  BarChart3, 
  Gift, 
  Tag, 
  Wrench,
  LogOut,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

const NAV_GROUPS: { 
  label: string | null; 
  items: { href: string; label: string; exact?: boolean; icon: React.ElementType }[] 
}[] = [
  {
    label: null,
    items: [{ href: "/admin", label: "Dashboard", exact: true, icon: LayoutDashboard }],
  },
  {
    label: "Operaciones",
    items: [
      { href: "/admin/rifas", label: "Rifas", icon: Ticket },
      { href: "/admin/boletos", label: "Boletos", icon: CheckSquare },
      { href: "/admin/comprobantes", label: "Comprobantes", icon: FileText },
      { href: "/admin/servicios", label: "Servicios", icon: Wrench },
    ],
  },
  {
    label: "Clientes",
    items: [
      { href: "/admin/clientes", label: "CRM Clientes", icon: Users },
      { href: "/admin/codigos", label: "Marketing", icon: Tag },
      { href: "/admin/regalos", label: "Cortesías", icon: Gift },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/admin/whatsapp", label: "WhatsApp Bot", icon: MessageSquare },
      { href: "/admin/tarjetas", label: "Pagos", icon: CreditCard },
      { href: "/admin/contenido", label: "Web Core", icon: Settings },
    ],
  },
  {
    label: "Data Insights",
    items: [
      { href: "/admin/reportes", label: "Reportes", icon: BarChart3 },
      { href: "/admin/metricas", label: "Analytics Pro", icon: BarChart3 },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState("admin");

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
      } else {
        const match = document.cookie.match(new RegExp('(^| )__role=([^;]+)'));
        if (match) setRole(match[2]);
        setReady(true);
      }
    });
    return unsub;
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;
  
  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Sincronizando...</p>
      </div>
    );
  }

  async function logout() {
    await signOut(auth);
    await fetch("/api/admin/session", { method: "DELETE" });
    router.push("/admin/login");
  }

  const STAFF_PATHS = ["/admin/boletos", "/admin/comprobantes", "/admin/servicios"];
  const visibleNavGroups = NAV_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => role === "admin" || STAFF_PATHS.includes(item.href))
  })).filter(group => group.items.length > 0);

  return (
    <div className="min-h-screen flex bg-slate-50/50 font-sans text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen z-50">
        <div className="h-24 px-8 border-b border-slate-50 flex items-center justify-between">
          <div className="scale-90 origin-left">
            <Logo size="sm" showText={true} />
          </div>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
             <ShieldCheck size={18} strokeWidth={2.5} />
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-10 overflow-y-auto custom-scrollbar">
          {visibleNavGroups.map((group, gi) => (
            <div key={gi} className="space-y-3">
              {group.label && (
                <p className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center justify-between px-6 py-4 transition-all duration-300 relative ${
                        active
                          ? "text-indigo-600 bg-indigo-50/50"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <Icon size={18} strokeWidth={active ? 2.5 : 2} className={active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-700"} />
                        <span className={active ? "font-black tracking-tight" : "font-semibold"}>{item.label}</span>
                      </div>
                      
                      {active && (
                        <>
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                          <ChevronRight size={14} className="text-indigo-300 relative z-10" />
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button
            onClick={logout}
            className="group w-full flex items-center gap-4 px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
              <LogOut size={16} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span>Finalizar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-slate-50/50">
        <div className="p-10 lg:p-16 max-w-[1400px] mx-auto min-h-screen">
          {children}
          
          <footer className="mt-20 pt-10 border-t border-slate-100 hidden lg:flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Rifas Pro Landing • Admin Engine v2.0</p>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Sistema Operativo
              </span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
