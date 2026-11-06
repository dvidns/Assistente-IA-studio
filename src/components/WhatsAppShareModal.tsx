import React, { useState } from "react";
import { MessageSquare, Copy, Check, ExternalLink, X } from "lucide-react";
import { openWhatsAppLink, formatPhone } from "../lib/utils";

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  clientName: string;
  initialMessage: string;
}

export function WhatsAppShareModal({
  isOpen,
  onClose,
  phone,
  clientName,
  initialMessage,
}: WhatsAppShareModalProps) {
  const [message, setMessage] = useState(initialMessage);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSend = () => {
    openWhatsAppLink(phone, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Mensagem para WhatsApp</h3>
              <p className="text-xs text-gray-500">
                {clientName} • {formatPhone(phone)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Prévia do Texto (editável)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={7}
            className="w-full text-sm p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all text-gray-800"
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
            {copied ? "Copiado!" : "Copiar Texto"}
          </button>
          <button
            type="button"
            onClick={handleSend}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm font-medium shadow-sm transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
