/**
 * Configuracion centralizada de la calculadora de gastos de venta.
 * Todos los parametros fiscales y comerciales viven aqui para poder
 * actualizarlos sin tocar la interfaz.
 * Version: 2026.1
 */

export type AgencyFeeType = "percentage" | "fixed";

export const AGENCY_FEE = {
  type: "percentage" as AgencyFeeType,
  value: 0.03,
  vat: 0.21,
  disclaimer:
    "La tarifa de cada agencia depende de la agencia que elijas. Hemos usado un porcentaje orientativo del 3\u00A0% + IVA.",
};

export const MINOR_COSTS_FIXED = 450;

export type PlusvaliaRange = { low: number; high: number };

export const PLUSVALIA_DEFAULT: PlusvaliaRange = { low: 0.003, high: 0.008 };

export const PLUSVALIA_BY_MUNICIPALITY: Record<string, PlusvaliaRange> = {};

export type IrpfBracket = { upTo: number; rate: number };

export const IRPF_BRACKETS: IrpfBracket[] = [
  { upTo: 6_000, rate: 0.19 },
  { upTo: 50_000, rate: 0.21 },
  { upTo: 200_000, rate: 0.23 },
  { upTo: 300_000, rate: 0.27 },
  { upTo: Infinity, rate: 0.3 },
];

export const PRIVACY_URL = "/privacidad/";
export const CALCULATION_VERSION = "2026.1";
export const MADRID_MUNICIPALITIES: string[] = [
  "Acebeda (La)",
  "Ajalvir",
  "Alameda del Valle",
  "Alamo (El)",
  "Alcala de Henares",
  "Alcobendas",
  "Alcorcon",
  "Aldea del Fresno",
  "Algete",
  "Alpedrete",
  "Ambite",
  "Anchuelo",
  "Aranjuez",
  "Arganda del Rey",
  "Arroyomolinos",
  "Atazar (El)",
  "Batres",
  "Becerril de la Sierra",
  "Belmonte de Tajo",
  "Berrueco (El)",
  "Berzosa del Lozoya",
  "Boadilla del Monte",
  "Boalo (El)",
  "Braojos",
  "Brea de Tajo",
  "Brunete",
  "Buitrago del Lozoya",
  "Bustarviejo",
  "Cabanillas de la Sierra",
  "Cabrera (La)",
  "Cadalso de los Vidrios",
  "Camarma de Esteruelas",
  "Campo Real",
  "Canencia",
  "Carabana",
  "Casarrubuelos",
  "Cenicientos",
  "Cercedilla",
  "Cervera de Buitrago",
  "Chapineria",
  "Chinchon",
  "Ciempozuelos",
  "Cobena",
  "Collado Mediano",
  "Collado Villalba",
  "Colmenar de Oreja",
  "Colmenar del Arroyo",
  "Colmenar Viejo",
  "Colmenarejo",
  "Corpa",
  "Coslada",
  "Cubas de la Sagra",
  "Daganzo de Arriba",
  "Escorial (El)",
  "Estremera",
  "Fresnedillas de la Oliva",
  "Fresno de Torote",
  "Fuenlabrada",
  "Fuente el Saz de Jarama",
  "Fuentidueña de Tajo",
  "Galapagar",
  "Garganta de los Montes",
  "Gargantilla del Lozoya",
  "Gascones",
  "Getafe",
  "Grinon",
  "Guadalix de la Sierra",
  "Guadarrama",
  "Hiruela (La)",
  "Horcajo de la Sierra",
  "Horcajuelo de la Sierra",
  "Hoyo de Manzanares",
  "Humanes de Madrid",
  "Leganes",
  "Loeches",
  "Lozoya",
  "Lozoyuela-Navas-Sieteiglesias",
  "Madarcos",
  "Madrid",
  "Majadahonda",
  "Manzanares el Real",
  "Meco",
  "Mejorada del Campo",
  "Miraflores de la Sierra",
  "Molar (El)",
  "Molinos (Los)",
  "Montejo de la Sierra",
  "Moraleja de Enmedio",
  "Moralzarzal",
  "Morata de Tajuna",
  "Mostoles",
  "Navacerrada",
  "Navalafuente",
  "Navalagamella",
  "Navalcarnero",
  "Navarredonda y San Mames",
  "Navas del Rey",
  "Nuevo Baztan",
  "Olmeda de las Fuentes",
  "Orusco de Tajuna",
  "Paracuellos de Jarama",
  "Parla",
  "Patones",
  "Pedrezuela",
  "Pelayos de la Presa",
  "Perales de Tajuna",
  "Pezuela de las Torres",
  "Pinilla del Valle",
  "Pinto",
  "Pinuecar-Gandullas",
  "Pozuelo de Alarcon",
  "Pozuelo del Rey",
  "Pradena del Rincon",
  "Puebla de la Sierra",
  "Puentes Viejas",
  "Quijorna",
  "Rascafria",
  "Reduena",
  "Ribatejada",
  "Rivas-Vaciamadrid",
  "Robledillo de la Jara",
  "Robledo de Chavela",
  "Robregordo",
  "Rozas de Madrid (Las)",
  "Rozas de Puerto Real",
  "San Agustin del Guadalix",
  "San Fernando de Henares",
  "San Lorenzo de El Escorial",
  "San Martin de la Vega",
  "San Martin de Valdeiglesias",
  "San Sebastian de los Reyes",
  "Santa Maria de la Alameda",
  "Santorcaz",
  "Santos de la Humosa (Los)",
  "Serna del Monte (La)",
  "Serranillos del Valle",
  "Sevilla la Nueva",
  "Somosierra",
  "Soto del Real",
  "Talamanca de Jarama",
  "Tielmes",
  "Titulcia",
  "Torrejon de Ardoz",
  "Torrejon de la Calzada",
  "Torrejon de Velasco",
  "Torrelaguna",
  "Torrelodones",
  "Torremocha de Jarama",
  "Torres de la Alameda",
  "Tres Cantos",
  "Valdaracete",
  "Valdeavero",
  "Valdelaguna",
  "Valdemanco",
  "Valdemaqueda",
  "Valdemorillo",
  "Valdemoro",
  "Valdeolmos-Alalpardo",
  "Valdepielagos",
  "Valdetorres de Jarama",
  "Valdilecha",
  "Valverde de Alcala",
  "Velilla de San Antonio",
  "Vellon (El)",
  "Venturada",
  "Villa del Prado",
  "Villaconejos",
  "Villalbilla",
  "Villamanrique de Tajo",
  "Villamanta",
  "Villamantilla",
  "Villanueva de la Canada",
  "Villanueva de Perales",
  "Villanueva del Pardillo",
  "Villar del Olmo",
  "Villarejo de Salvanes",
  "Villaviciosa de Odon",
  "Zarzalejo",
];

// ---- Funciones de calculo ----

/** Calcula los honorarios totales (con IVA). */
export function computeFee(salePrice: number): number {
  const base =
    AGENCY_FEE.type === "percentage"
      ? salePrice * AGENCY_FEE.value
      : AGENCY_FEE.value;
  return base * (1 + AGENCY_FEE.vat);
}

/** Devuelve la horquilla de plusvalia para un municipio. */
export function getPlusvaliaRange(municipality: string): PlusvaliaRange {
  return PLUSVALIA_BY_MUNICIPALITY[municipality] ?? PLUSVALIA_DEFAULT;
}

/** Calcula IRPF progresivo sobre una ganancia patrimonial. */
export function computeProgressiveIrpf(gain: number): number {
  if (gain <= 0) return 0;
  let remaining = gain;
  let tax = 0;
  let prevLimit = 0;
  for (const bracket of IRPF_BRACKETS) {
    const taxable = Math.min(remaining, bracket.upTo - prevLimit);
    tax += taxable * bracket.rate;
    remaining -= taxable;
    prevLimit = bracket.upTo;
    if (remaining <= 0) break;
  }
  return tax;
}

/** Redondea a centenas de euros. */
export function roundToHundreds(n: number): number {
  return Math.round(n / 100) * 100;
}

/** Formatea un numero como moneda espanola: 400.000 euros */
export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export type CalculationResult = {
  salePrice: number;
  feeTotal: number;
  plusvaliaMin: number;
  plusvaliaMax: number;
  irpfMin: number;
  irpfMax: number;
  irpfExempt: boolean;
  exemptionReason: "age_65" | "reinvestment" | null;
  availableLow: number;
  availableHigh: number;
  noGain: boolean;
  municipalityConfigured: boolean;
};

export function calculate(params: {
  salePrice: number;
  purchasePrice: number;
  municipality: string;
  purchaseYear: number;
  isMainHome: boolean;
  age65Plus: boolean;
  fullReinvestment: boolean;
}): CalculationResult {
  const {
    salePrice,
    purchasePrice,
    municipality,
    isMainHome,
    age65Plus,
    fullReinvestment,
  } = params;

  const feeTotal = computeFee(salePrice);
  const rates = getPlusvaliaRange(municipality);
  const municipalityConfigured = municipality in PLUSVALIA_BY_MUNICIPALITY;
  const noGain = salePrice <= purchasePrice;

  let plusvaliaMin: number;
  let plusvaliaMax: number;
  if (noGain) {
    plusvaliaMin = 0;
    plusvaliaMax = 0;
  } else {
    plusvaliaMin = salePrice * rates.low;
    plusvaliaMax = salePrice * rates.high;
  }

  const irpfExempt =
    (isMainHome && age65Plus) ||
    (isMainHome && !age65Plus && fullReinvestment);

  let exemptionReason: "age_65" | "reinvestment" | null = null;
  if (irpfExempt) {
    exemptionReason = age65Plus ? "age_65" : "reinvestment";
  }

  const gainWithMinPlusvalia = Math.max(
    0,
    salePrice - purchasePrice - feeTotal - plusvaliaMin - MINOR_COSTS_FIXED,
  );
  const gainWithMaxPlusvalia = Math.max(
    0,
    salePrice - purchasePrice - feeTotal - plusvaliaMax - MINOR_COSTS_FIXED,
  );

  const irpfForMin = irpfExempt ? 0 : computeProgressiveIrpf(gainWithMinPlusvalia);
  const irpfForMax = irpfExempt ? 0 : computeProgressiveIrpf(gainWithMaxPlusvalia);

  const availableWithMinPlusvalia = roundToHundreds(
    salePrice - feeTotal - plusvaliaMin - MINOR_COSTS_FIXED - irpfForMin,
  );
  const availableWithMaxPlusvalia = roundToHundreds(
    salePrice - feeTotal - plusvaliaMax - MINOR_COSTS_FIXED - irpfForMax,
  );

  const availableLow = Math.min(availableWithMinPlusvalia, availableWithMaxPlusvalia);
  const availableHigh = Math.max(availableWithMinPlusvalia, availableWithMaxPlusvalia);

  return {
    salePrice,
    feeTotal: roundToHundreds(feeTotal),
    plusvaliaMin: roundToHundreds(plusvaliaMin),
    plusvaliaMax: roundToHundreds(plusvaliaMax),
    irpfMin: roundToHundreds(Math.min(irpfForMin, irpfForMax)),
    irpfMax: roundToHundreds(Math.max(irpfForMin, irpfForMax)),
    irpfExempt,
    exemptionReason,
    availableLow,
    availableHigh,
    noGain,
    municipalityConfigured,
  };
}
