/* eslint-disable */
import { Timestamp } from "firebase/firestore";

export const DEFAULT_SITE_TEXTS = {
  hero_title: "Tu Sistema de Rifas Profesional",
  hero_subtitle: "Esta es una demostración de cómo se vería tu propio sitio de sorteos.",
  hero_banks_text: "BBVA · Santander · Banorte",
  how_it_works_title: "¿Cómo funciona?",
  how_it_works_steps: [
    { title: "Demo Step 1", desc: "El usuario ve tus rifas." },
    { title: "Demo Step 2", desc: "Eligen sus números." }
  ],
  faq_items: [{ q: "¿Es esto real?", a: "No, es una demostración del sistema." }]
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Ganador {
  numero: number;
  nombre: string;
  apellidos: string;
  folio: string;
  anunciado_at: string;
}

export interface Premio {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  es_principal: boolean;
  condicion?: string;
}

export interface DiscountCode {
  id: string;
  codigo: string;
  porcentaje: number;
  activo: boolean;
  usos: number;
  max_usos: number;
  rifa_ids: string[];
}

export interface Rifa {
  id?: string;
  nombre: string;
  descripcion: string;
  precio_boleto: number;
  imagen_url: string;
  imagenes_url: string[];
  texto_inferior: string;
  num_inicio: number;
  num_fin: number;
  fecha_sorteo: string;
  activa: boolean;
  oportunidades?: number;
  num_vendidos: number;
  num_apartados: number;
  premios?: Premio[];
  ganador?: Ganador;
}

export interface Boleto {
  id?: string;
  folio: string;
  rifa_id: string;
  numeros: number[];
  numeros_completos?: number[];
  nombre: string;
  apellidos: string;
  celular: string;
  estado: string;
  codigo_descuento: string;
  descuento_aplicado: number;
  precio_total: number;
  status: "pendiente" | "pagado" | "cancelado";
  created_at: Timestamp;
}

export interface WhatsAppConfig {
  numeros: string[];
  indice_actual: number;
  ayuda_numero?: string;
}

export interface AppSettings {
  mostrar_apartados: boolean;
  cancelacion_activa: boolean;
  cancelacion_horas: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  mostrar_apartados: true,
  cancelacion_activa: false,
  cancelacion_horas: 24,
};

export interface BankAccount {
  id?: string;
  banco: string;
  titular: string;
  clabe: string;
  num_cuenta: string;
  activo: boolean;
  color?: string;
}

export interface Comprobante {
  id: string;
  folio: string;
  folios: string[];
  nombre: string;
  celular: string;
  url: string;
  monto_total: number;
  comentario?: string;
  admin_comentario?: string;
  status: "pendiente" | "aprobado" | "rechazado";
  created_at: Timestamp;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const DUMMY_RIFA: Rifa = {
  id: "demo-1",
  nombre: "¡Rifa Demo de Próximo Sorteo!",
  descripcion: "Esta es una vista previa de cómo tus clientes verán tus rifas. El diseño es moderno, rápido y totalmente adaptable a móviles.",
  precio_boleto: 100,
  imagen_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop",
  imagenes_url: [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop"
  ],
  texto_inferior: "Recuerda que esto es solo una demostración visual. \n\n¡Anímate a elegir tus números!",
  num_inicio: 0,
  num_fin: 99,
  fecha_sorteo: new Date(Date.now() + 86400000 * 7).toISOString(),
  activa: true,
  num_vendidos: 15,
  num_apartados: 8,
  premios: [
    { id: "p1", nombre: "Premio Mayor: Auto Deportivo", es_principal: true, descripcion: "Un regalo increíble para el ganador de esta rifa demo." },
    { id: "p2", nombre: "Bono por pronto pago", es_principal: false, condicion: "Si pagas en las primeras 12h", descripcion: "$1,000 MXN adicionales" }
  ]
};

const DUMMY_VEN_APS = {
  vendidos: [7, 24, 45, 88, 12, 3, 99],
  apartados: [5, 18, 77]
};

// ─── Mock Functions (BULLETPROOF VERSION) ────────────────────────────────────

export async function getRifas(): Promise<Rifa[]> { return [DUMMY_RIFA]; }
export async function getRifa(..._args: any[]): Promise<Rifa | null> { return DUMMY_RIFA; }
export async function createRifa(..._args: any[]) { return "demo-id"; }
export async function updateRifa(..._args: any[]) { }
export async function deleteRifa(..._args: any[]) { }
export async function anunciarGanador(..._args: any[]) { return {} as any; }
export async function registrarNumerosVendidos(..._args: any[]) { }

export async function getNumerosOcupados(..._args: any[]) { return DUMMY_VEN_APS; }
export async function reservarNumeros(..._args: any[]) {
  console.log("DEMO: Reserva simulada de números.");
}

export async function markBoletoPagadoConNumeros(..._args: any[]) { }
export async function cancelApartado(..._args: any[]) { }
export async function cancelPagado(..._args: any[]) { }
export async function revertPagadoToApartado(..._args: any[]) { }
export async function createBoleto(..._args: any[]) { return "demo-folio"; }

export async function getBoletos(): Promise<Boleto[]> { return []; }
export async function getBoletosPaginados(..._args: any[]): Promise<{ boletos: Boleto[], hasMore: boolean, lastDoc: any }> {
  return { boletos: [], hasMore: false, lastDoc: null };
}
export async function getBoletoByFolio(..._args: any[]): Promise<Boleto | null> { return null; }

export async function getWhatsAppConfig() {
  return { numeros: ["5500001234"], indice_actual: 0, ayuda_numero: "5500001234" };
}

export async function getBankAccounts() {
  return [
    { id: "1", banco: "BBVA", titular: "Demo Usuario", num_cuenta: "0123 4567 8901", clabe: "012345678901234567", activo: true, color: "BLUE" }
  ];
}

export async function getAppSettings() { return DEFAULT_SETTINGS; }
export async function setAppSettings(..._args: any[]) { }

export async function getSiteTexts() { return DEFAULT_SITE_TEXTS as any; }
export async function setSiteTexts(..._args: any[]) { }
export async function cancelarBoletosExpirados(..._args: any[]) { return 0; }
export async function getAndRotateWhatsApp() { return "5500001234"; }
export async function setWhatsAppConfig(..._args: any[]) { }
export async function upsertBankAccount(..._args: any[]) { }
export async function deleteBankAccount(..._args: any[]) { }

export async function createComprobante(..._args: any[]) { return "demo-id"; }
export async function getComprobantesPaginados(..._args: any[]): Promise<{ comprobantes: any[], hasMore: boolean, lastDoc: any }> {
  return { comprobantes: [], hasMore: false, lastDoc: null };
}
export async function updateComprobanteStatus(..._args: any[]) { }
export async function updateComprobanteComentario(..._args: any[]) { }
export async function getComprobanteByFolio(..._args: any[]) { return null; }
export async function validateDiscountCode(..._args: any[]) { return null; }
export async function incrementDiscountUse(..._args: any[]) { }
export async function getBoletosByCelular(..._args: any[]): Promise<Boleto[]> { return []; }
export async function getBoletosByNumero(..._args: any[]): Promise<Boleto[]> { return []; }
export async function getBoletosByRifa(..._args: any[]): Promise<Boleto[]> { return []; }
export async function getDiscountCodes(): Promise<DiscountCode[]> { return []; }
export async function createDiscountCode(..._args: any[]) { return "demo-coupon-id"; }
export async function updateDiscountCode(..._args: any[]) { }
export async function deleteDiscountCode(..._args: any[]) { }
