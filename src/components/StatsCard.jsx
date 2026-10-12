import { motion } from "framer-motion";
import { ShoppingBag, Users, DollarSign, ArrowUpRight, Activity, ShieldCheck, Zap } from "lucide-react";

const StatsCard = ({ title, value, change, icon: Icon, gradient }) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="glass-card p-6 sm:p-7 rounded-2xl relative overflow-hidden group transition-all duration-300 cursor-default select-none"
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex items-center justify-between gap-4 relative z-10">
        <div>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/60">{title}</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">{value}</h2>
          {change !== undefined && change !== null && (
            <p className="flex items-center gap-1 text-xs sm:text-sm text-emerald-400 mt-2 font-medium">
              <ArrowUpRight size={16} />
              <span>{typeof change === "number" ? `+${change}%` : change}</span>
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`p-4 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0 ${
              gradient || "bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_24px_rgba(6,182,212,0.35)]"
            }`}
          >
            <Icon size={26} className="text-white" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export { ShoppingBag, Users, DollarSign, ArrowUpRight, Activity, ShieldCheck, Zap };
export default StatsCard;
