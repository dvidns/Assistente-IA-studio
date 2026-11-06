export function formatMoney(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return "R$ 0,00";
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR");
  } catch {
    return dateStr;
  }
}

export function formatDateLongBR(date: Date = new Date()): string {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatPhone(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function getWhatsAppNumber(phone: string): string {
  const digits = cleanPhone(phone);
  if (!digits) return "";
  if (digits.startsWith("55")) return digits;
  return `55${digits}`;
}

export function getWhatsAppUrl(phone: string, message: string, useWeb = false): string {
  const number = getWhatsAppNumber(phone);
  const text = encodeURIComponent(message);
  if (useWeb) {
    return `https://web.whatsapp.com/send?phone=${number}&text=${text}`;
  }
  return `https://wa.me/${number}?text=${text}`;
}

export function openWhatsAppLink(phone: string, message: string): void {
  const url = getWhatsAppUrl(phone, message);
  window.open(url, "_blank", "noopener,noreferrer");
}
