import React from "react";
import { StatusAgendamento, StatusOrcamento } from "../types";

interface StatusBadgeProps {
  status: StatusAgendamento | StatusOrcamento;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  switch (status) {
    case "confirmado":
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 ${className}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-blue-600"></span>
          Confirmado
        </span>
      );
    case "concluido":
    case "aprovado":
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-600"></span>
          {status === "aprovado" ? "Aprovado" : "Concluído"}
        </span>
      );
    case "pendente":
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 ${className}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-600"></span>
          Pendente
        </span>
      );
    case "retorno":
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 ${className}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-purple-600"></span>
          Retorno
        </span>
      );
    case "cancelado":
    case "recusado":
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200 ${className}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-red-600"></span>
          {status === "recusado" ? "Recusado" : "Cancelado"}
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 ${className}`}>
          {status}
        </span>
      );
  }
}
