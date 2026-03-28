import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  lightText?: boolean;
}

const SIZES = {
  sm: { circle: "w-8 h-8 text-sm", text: "text-lg" },
  md: { circle: "w-10 h-10 text-base", text: "text-xl" },
  lg: { circle: "w-16 h-16 text-2xl", text: "text-3xl" },
  xl: { circle: "w-28 h-28 text-4xl", text: "text-5xl" },
};

export default function Logo({ size = "md", showText = true, lightText = false }: LogoProps) {
  const s = SIZES[size];

  return (
    <div className="flex items-center gap-3">
      {/* High-fidelity symbol */}
      <div className={`${s.circle} rounded-[1.25rem] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200/50 flex-shrink-0 relative group-hover:scale-110 transition-transform duration-500`}>
         <div className="font-black italic">S</div>
      </div>

      {showText && (
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className={`${s.text} font-black tracking-tighter ${lightText ? "text-white" : "text-slate-900"}`}>
            SORTEOS
          </span>
          <span className={`${s.text} font-black tracking-tighter ${lightText ? "text-indigo-500" : "text-indigo-600"}`}>
            PRO
          </span>
        </div>
      )}
    </div>
  );
}
