/* eslint-disable */
import { Timestamp } from "firebase/firestore";

export const DEFAULT_SITE_TEXTS = {
  hero_title: "Tu Sistema de Rifas Profesional",
  hero_subtitle: "Esta es una demostración de cómo se vería tu propio sitio de sorteos.",
  hero_banks_text: "BBVA · Santander · Banorte · OXXO",
  how_it_works_title: "¿Cómo funciona?",
  how_it_works_steps: [
    { title: "Elige tu Rifa", desc: "Explora nuestros sorteos activos y selecciona el premio que quieres ganar." },
    { title: "Selecciona tus Números", desc: "Usa nuestro buscador o selecciona manualmente tus números de la suerte en el grid." },
    { title: "Realiza el Pago", desc: "Transfiere a nuestras cuentas oficiales y sube tu comprobante o envíalo por WhatsApp." },
    { title: "Recibe tu Boleto", desc: "Una vez validado, recibirás tu folio digital para participar en el sorteo." },
    { title: "¡Suerte!", desc: "Sigue la transmisión en vivo por nuestras redes sociales para conocer al ganador." }
  ],
  faq_items: [
    { q: "¿Es esto un sitio real?", a: "No, esto es una DEMOSTRACIÓN del software de rifas. No se aceptan pagos reales ni se entregan premios reales aquí." },
    { q: "¿Cómo se eligen los ganadores?", a: "Los ganadores se eligen basándonos en los resultados de la Lotería Nacional o mediante un sorteo digital certificado en vivo." },
    { q: "¿Qué métodos de pago aceptan?", a: "Aceptamos transferencias bancarias (BBVA, Santander), depósitos en OXXO y pagos con tarjeta mediante pasarelas seguras." },
    { q: "¿Cómo recibo mi número?", a: "Inmediatamente después de apartar se te asignará un folio. Cuando el pago sea validado, tu estatus cambiará a 'Pagado'." },
    { q: "¿Puedo pedir un reembolso?", a: "Debido a la naturaleza de los sorteos, no se realizan reembolsos una vez generados los números." }
  ],
  faq_title: "Preguntas Frecuentes",
  faq_subtitle: "Todo lo que necesitas saber sobre nuestro sistema de sorteos.",
  about_mission_title: "Nuestra Misión",
  about_mission_text: "En Sorteos Pro, nos dedicamos a ofrecer la plataforma de sorteos más segura, transparente y emocionante de México. Transformamos la ilusión en realidad mediante procesos certificados y tecnología de vanguardia.",
  about_values: [
    { title: "Transparencia", desc: "Todos nuestros sorteos se basan en la Lotería Nacional o se realizan en vivo con certificación digital.", icon: "🛡️" },
    { title: "Seguridad", desc: "Tus datos y transacciones están protegidos con los más altos estándares de cifrado y seguridad web.", icon: "🔒" },
    { title: "Confianza", desc: "Cientos de ganadores avalan nuestra trayectoria y compromiso con la entrega honesta de premios.", icon: "💎" }
  ],
  about_why_title: "¿Por qué elegir Sorteos Pro?",
  about_why_items: [
    "Sorteos 100% legales y transparentes.",
    "Entrega inmediata de premios garantizada.",
    "Atención al cliente personalizada 24/7.",
    "Plataforma fácil de usar desde cualquier dispositivo.",
    "Pagos seguros y múltiples métodos de depósito.",
    "Resultados verificables en tiempo real."
  ]
};

export interface FaqItem {
  q: string;
  a: string;
}

export interface HowItWorksStep {
  title: string;
  desc: string;
}

export interface ValueCard {
  title: string;
  desc: string;
  icon: string;
}

export interface SiteTexts {
  hero_title: string;
  hero_subtitle: string;
  hero_banks_text: string;
  how_it_works_title: string;
  how_it_works_steps: HowItWorksStep[];
  faq_items: FaqItem[];
  faq_title: string;
  faq_subtitle: string;
  about_mission_title: string;
  about_mission_text: string;
  about_values: ValueCard[];
  about_why_title: string;
  about_why_items: string[];
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Ganador {
  numero: number;
  nombre: string;
  apellidos: string;
  folio: string;
  anunciado_at: string;
  [key: string]: any;
}

export interface Premio {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  es_principal: boolean;
  condicion?: string;
  [key: string]: any;
}

export interface DiscountCode {
  id: string;
  codigo: string;
  porcentaje: number;
  activo: boolean;
  usos: number;
  max_usos: number;
  rifa_ids: string[];
  [key: string]: any;
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
  [key: string]: any;
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
  status: string;
  created_at: Timestamp;
  [key: string]: any;
}

export interface WhatsAppConfig {
  numeros: string[];
  indice_actual: number;
  ayuda_numero?: string;
  [key: string]: any;
}

export interface AppSettings {
  mostrar_apartados: boolean;
  cancelacion_activa: boolean;
  cancelacion_horas: number;
  [key: string]: any;
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
  [key: string]: any;
}

export interface Comprobante {
  id: string;
  folio: string;
  folios: string[];
  nombre: string;
  celular: string;
  url: string;
  archivo_url?: string;
  archivo_tipo?: string;
  monto_total: number;
  comentario?: string;
  admin_comentario?: string;
  status: string;
  created_at: Timestamp;
  [key: string]: any;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const DUMMY_RIFA: Rifa = {
  id: "demo-1",
  nombre: "¡iPhone 16 Pro Max + Apple Watch!",
  descripcion: "Participa y estrena el combo Apple más completo. El sorteo se realizará cuando se vendan el 90% de los boletos.",
  precio_boleto: 150,
  imagen_url: "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?q=80&w=2070&auto=format&fit=crop",
  imagenes_url: [
    "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2000&auto=format&fit=crop"
  ],
  texto_inferior: "Recuerda que esto es solo una demostración visual. \n\n¡Anímate a elegir tus números!",
  num_inicio: 0,
  num_fin: 999,
  fecha_sorteo: new Date(Date.now() + 86400000 * 7).toISOString(),
  activa: true,
  num_vendidos: 245,
  num_apartados: 42,
  premios: [
    { id: "p1", nombre: "Premio Principal: iPhone 16 Pro Max", es_principal: true, descripcion: "Color Titanio Natural, 256GB." },
    { id: "p2", nombre: "Bono por pronto pago", es_principal: false, condicion: "Si pagas en las primeras 6h", descripcion: "Apple Watch Series 10 adicional" }
  ]
};

const DUMMY_RIFA_VANS: Rifa = {
  id: "demo-van",
  nombre: "Camioneta Familiar GMC Sierra 2024",
  descripcion: "Una fiera en el camino, totalmente equipada. ¡Puede ser tuya por solo $450 pesos!",
  precio_boleto: 450,
  imagen_url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop",
  imagenes_url: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop"],
  texto_inferior: "Válido en toda la República Mexicana.",
  num_inicio: 0,
  num_fin: 1999,
  fecha_sorteo: new Date(Date.now() + 86400000 * 14).toISOString(),
  activa: true,
  num_vendidos: 120,
  num_apartados: 15,
  premios: [
    { id: "p1", nombre: "GMC Sierra AT4X", es_principal: true, descripcion: "Nueva de agencia, color Negro Onix." }
  ]
};

const DUMMY_RIFA_2: Rifa = {
  id: "demo-2",
  nombre: "Sorteo Relámpago: PlayStation 5 Slim",
  descripcion: "Esta rifa ya terminó y ya entregamos el premio a nuestro afortunado ganador.",
  precio_boleto: 50,
  imagen_url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2070&auto=format&fit=crop",
  imagenes_url: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2070&auto=format&fit=crop"],
  texto_inferior: "Gracias a todos por participar.",
  num_inicio: 0,
  num_fin: 99,
  fecha_sorteo: new Date(Date.now() - 86400000 * 3).toISOString(),
  activa: false,
  num_vendidos: 100,
  num_apartados: 0,
  ganador: {
    numero: 42,
    nombre: "Lucas",
    apellidos: "Mora",
    folio: "SP-999",
    anunciado_at: new Date(Date.now() - 86400000 * 3).toISOString()
  }
};

const DUMMY_RIFA_3: Rifa = {
  id: "demo-3",
  nombre: "Especial de Navidad: MacBook Pro M3",
  descripcion: "El equipo definitivo para tu trabajo o estudios. ¡No te quedes sin tus boletos!",
  precio_boleto: 200,
  imagen_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop",
  imagenes_url: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop"],
  texto_inferior: "¡Ideal para creadores de contenido!",
  num_inicio: 0,
  num_fin: 499,
  fecha_sorteo: new Date(Date.now() - 86400000 * 10).toISOString(),
  activa: false,
  num_vendidos: 500,
  num_apartados: 0,
  ganador: {
    numero: 127,
    nombre: "Sofía",
    apellidos: "Valenzuela",
    folio: "SP-A82",
    anunciado_at: new Date(Date.now() - 86400000 * 10).toISOString()
  }
};

const DUMMY_BOLETOS: Boleto[] = [
  {
    id: "b1",
    folio: "SP-001",
    rifa_id: "demo-1",
    numeros: [7, 24, 156, 389],
    nombre: "Juan",
    apellidos: "Pérez",
    celular: "5512345678",
    estado: "CDMX",
    codigo_descuento: "",
    descuento_aplicado: 0,
    precio_total: 600,
    status: "pagado",
    created_at: Timestamp.now()
  },
  {
    id: "b2",
    folio: "SP-002",
    rifa_id: "demo-1",
    numeros: [45, 921],
    nombre: "María",
    apellidos: "García",
    celular: "5587654321",
    estado: "Jalisco",
    codigo_descuento: "PROMO",
    descuento_aplicado: 10,
    precio_total: 270,
    status: "pendiente",
    created_at: Timestamp.now()
  },
  {
    id: "b3",
    folio: "SP-003",
    rifa_id: "demo-2",
    numeros: [42],
    nombre: "Lucas",
    apellidos: "Mora",
    celular: "5599008877",
    estado: "Nuevo León",
    codigo_descuento: "",
    descuento_aplicado: 0,
    precio_total: 50,
    status: "pagado",
    created_at: Timestamp.fromDate(new Date(Date.now() - 86400000 * 2))
  },
  {
    id: "b4",
    folio: "SP-004",
    rifa_id: "demo-van",
    numeros: [2, 10, 50, 100, 250, 500],
    nombre: "Pedro",
    apellidos: "Ramírez",
    celular: "5544332211",
    estado: "Sonora",
    codigo_descuento: "",
    descuento_aplicado: 0,
    precio_total: 2700,
    status: "pagado",
    created_at: Timestamp.now()
  },
  {
    id: "b5",
    folio: "SP-005",
    rifa_id: "demo-1",
    numeros: [100, 101, 102],
    nombre: "Roberto",
    apellidos: "Sánchez",
    celular: "5500112233",
    estado: "Querétaro",
    codigo_descuento: "",
    descuento_aplicado: 0,
    precio_total: 450,
    status: "pendiente",
    created_at: Timestamp.now()
  }
];

const DUMMY_VEN_APS = {
  vendidos: [
    7, 24, 42, 127, 2, 10, 50, 100, 250, 500, 1, 3, 4, 5, 8, 9, 11, 12, 13, 14, 15, 16,
    55, 67, 89, 112, 145, 234, 345, 456, 567, 678, 789, 890, 999, 123, 321, 432, 543, 654, 765, 876,
    210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220
  ],
  apartados: [
    45, 921, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610
  ]
};

// ─── Mock Functions (BULLETPROOF VERSION) ────────────────────────────────────

export async function getRifas(): Promise<Rifa[]> { 
  return [DUMMY_RIFA, DUMMY_RIFA_VANS, DUMMY_RIFA_2, DUMMY_RIFA_3]; 
}

export async function getRifa(id: string): Promise<Rifa | null> { 
  if (id === "demo-van") return DUMMY_RIFA_VANS;
  if (id === "demo-2") return DUMMY_RIFA_2;
  if (id === "demo-3") return DUMMY_RIFA_3;
  return DUMMY_RIFA; 
}

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

export async function getBoletos(): Promise<Boleto[]> { return DUMMY_BOLETOS; }
export async function getBoletosPaginados(..._args: any[]): Promise<{ boletos: Boleto[], hasMore: boolean, lastDoc: any }> {
  return { boletos: DUMMY_BOLETOS, hasMore: false, lastDoc: null };
}
export async function getBoletoByFolio(folio: string): Promise<Boleto | null> { 
  return DUMMY_BOLETOS.find(b => b.folio === folio) || null; 
}

export async function getWhatsAppConfig() {
  return { numeros: ["556625044016"], indice_actual: 0, ayuda_numero: "556625044016" };
}

export async function getBankAccounts() {
  return [
    { id: "1", banco: "BBVA", titular: "Sorteos Pro S.A. de C.V.", num_cuenta: "0123 4567 8901", clabe: "012345678901234567", activo: true, color: "BLUE" },
    { id: "2", banco: "Santander", titular: "Sorteos Pro S.A. de C.V.", num_cuenta: "9876 5432 1098", clabe: "987654321098765432", activo: true, color: "RED" },
    { id: "3", banco: "Banorte", titular: "Sorteos Pro S.A. de C.V.", num_cuenta: "5566 7788 9900", clabe: "556677889900112233", activo: true, color: "DARKRED" },
    { id: "4", banco: "OXXO / Depósito", titular: "Referencia OXXO Pay", num_cuenta: "1234 5678 9012 3456", clabe: "N/A", activo: true, color: "ORANGE" }
  ];
}

export async function getAppSettings() { return DEFAULT_SETTINGS; }
export async function setAppSettings(..._args: any[]) { }

export async function getSiteTexts() { return DEFAULT_SITE_TEXTS as any; }
export async function setSiteTexts(..._args: any[]) { }
export async function cancelarBoletosExpirados(..._args: any[]) { return 0; }
export async function getAndRotateWhatsApp() { return "556625044016"; }
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
export async function getBoletosByCelular(celular: string): Promise<Boleto[]> { 
  return DUMMY_BOLETOS.filter(b => b.celular === celular); 
}
export async function getBoletosByNumero(numero: number): Promise<Boleto[]> { 
  return DUMMY_BOLETOS.filter(b => b.numeros.includes(numero)); 
}
export async function getBoletosByRifa(rifa_id: string): Promise<Boleto[]> { 
  return DUMMY_BOLETOS.filter(b => b.rifa_id === rifa_id); 
}
export async function getDiscountCodes(): Promise<DiscountCode[]> { return []; }
export async function createDiscountCode(..._args: any[]) { return "demo-coupon-id"; }
export async function updateDiscountCode(..._args: any[]) { }
export async function deleteDiscountCode(..._args: any[]) { }
