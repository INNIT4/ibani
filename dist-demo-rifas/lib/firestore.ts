/* eslint-disable */
import { Timestamp } from "firebase/firestore";

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

export interface BankAccount {
  id?: string;
  banco: string;
  titular: string;
  clabe: string;
  num_cuenta: string;
  activo: boolean;
  color?: string;
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

// ─── Mock Functions ───────────────────────────────────────────────────────────

export async function getRifas(): Promise<Rifa[]> { return [DUMMY_RIFA]; }
export async function getRifa(_id: string): Promise<Rifa | null> { return DUMMY_RIFA; }
export async function createRifa(_data: any) { return "id"; }
export async function updateRifa(_id: string, _data: any) { }
export async function deleteRifa(_id: string) { }
export async function anunciarGanador(_id: string, _n: number) { return {} as any; }

export async function getNumerosOcupados(_id: string) { return DUMMY_VEN_APS; }
export async function reservarNumeros(_id: string, nums: number[]) { 
  console.log("DEMO: Reserva simulada de números:", nums);
}

export async function markBoletoPagadoConNumeros(_b: any) { }
export async function cancelApartado(_b: any) { }
export async function createBoleto(_d: any) { return "demo-folio"; }

export async function getBoletos() { return []; }
export async function getBoletosPaginados() { return { boletos: [], hasMore: false, lastDoc: null }; }
export async function getBoletoByFolio(_f: string) { return null; }

export async function getWhatsAppConfig() { 
  return { numeros: ["5500001234"], indice_actual: 0, ayuda_numero: "5500001234" }; 
}

export async function getBankAccounts() {
  return [
    { id: "1", banco: "BBVA", titular: "Demo Usuario", num_cuenta: "0123 4567 8901", clabe: "012345678901234567", activo: true, color: "BLUE" }
  ];
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

export async function getAppSettings() { return DEFAULT_SETTINGS; }
export async function setAppSettings(_d: any) { }

export async function getSiteTexts() {
  return {
    hero_title: "Tu Sistema de Rifas Profesional",
    hero_subtitle: "Esta es una demostración de cómo se vería tu propio sitio de sorteos.",
    hero_banks_text: "BBVA · Santander · Banorte",
    how_it_works_title: "¿Cómo funciona?",
    how_it_works_steps: [
      { title: "Demo Step 1", desc: "El usuario ve tus rifas." },
      { title: "Demo Step 2", desc: "Eligen sus números." }
    ],
    faq_items: [{ q: "¿Es esto real?", a: "No, es una demostración del sistema." }]
  } as any;
}
export async function setSiteTexts(_d: any) { }
export async function cancelarBoletosExpirados(_h: number) { return 0; }
export async function getAndRotateWhatsApp() { return "5500001234"; }
export async function setWhatsAppConfig(_d: any) { }
export async function upsertBankAccount(_id: string, _d: any) { }
export async function deleteBankAccount(_id: string) { }

export async function createComprobante(_d: any) { return "demo-id"; }
export async function getComprobantesPaginados() { return { comprobantes: [], hasMore: false, lastDoc: null }; }
export async function updateComprobanteStatus() { }
export async function updateComprobanteComentario() { }
export async function getComprobanteByFolio() { return null; }
export async function validateDiscountCode() { return null; }
export async function incrementDiscountUse() { }
export async function getBoletosByCelular() { return []; }
export async function getBoletosByNumero() { return []; }
export async function getBoletosByRifa() { return []; }
export async function getDiscountCodes() { return []; }
export async function createDiscountCode() { return "id"; }
export async function updateDiscountCode() { }
export async function deleteDiscountCode() { }
