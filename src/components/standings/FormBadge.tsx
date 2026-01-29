import React from "react";

interface FormBadgeProps {
  result: "W" | "L" | "D";
}

const FormBadge = ({ result }: FormBadgeProps) => {
  const styles = {
    W: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    L: "bg-red-500/20 text-red-400 border-red-500/30",
    D: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold border ${styles[result]}`}
    >
      {result}
    </span>
  );
};

export default FormBadge;
