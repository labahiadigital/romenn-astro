const API_URL = import.meta.env.PUBLIC_API_URL || "https://api.romenninmobiliaria.es";

export interface PublicProperty {
  reference: string;
  title: string | null;
  description: string | null;
  operation_type: string | null;
  property_type: string | null;
  price: number | null;
  rental_price: number | null;
  community_fees: number | null;
  m_cons: number | null;
  m_utiles: number | null;
  m_parcela: number | null;
  m_terraza: number | null;
  habitaciones: number | null;
  habdobles: number | null;
  banyos: number | null;
  aseos: number | null;
  planta: number | null;
  parking: number | null;
  antiguedad: number | null;
  conservation_status: string | null;
  energy_certificate_rating: string | null;
  heating_type: string | null;
  orientation_north: boolean | null;
  orientation_south: boolean | null;
  orientation_east: boolean | null;
  orientation_west: boolean | null;
  is_penthouse: boolean | null;
  is_duplex: boolean | null;
  is_studio: boolean | null;
  is_top_floor: boolean | null;
  virtual_tour_url: string | null;
  video_url: string | null;
  location: {
    city: string | null;
    district: string | null;
    zone: string | null;
    postal_code: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  features: Record<string, boolean | null>;
  photos: Array<{
    url: string;
    thumbnail_url: string | null;
    is_main: boolean;
    caption: string | null;
    position: number;
  }>;
  created_at: string | null;
  updated_at: string | null;
}

export interface PublicPropertyListItem {
  reference: string;
  title: string | null;
  operation_type: string | null;
  property_type: string | null;
  price: number | null;
  rental_price: number | null;
  m_cons: number | null;
  habitaciones: number | null;
  banyos: number | null;
  planta: number | null;
  parking: number | null;
  is_penthouse: boolean | null;
  is_duplex: boolean | null;
  is_studio: boolean | null;
  location: {
    city: string | null;
    district: string | null;
    zone: string | null;
    postal_code: string | null;
  };
  main_photo_url: string | null;
  photo_count: number;
  created_at: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export async function fetchProperties(params?: {
  page?: number;
  page_size?: number;
  search?: string;
}): Promise<PaginatedResponse<PublicPropertyListItem>> {
  const url = new URL(`${API_URL}/api/v1/public/properties`);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.page_size) url.searchParams.set("page_size", String(params.page_size));
  if (params?.search) url.searchParams.set("search", params.search);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchProperty(reference: string): Promise<PublicProperty> {
  const res = await fetch(`${API_URL}/api/v1/public/properties/${reference}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function formatPrice(price: number | null): string {
  if (!price) return "";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getLocationLabel(loc: { city?: string | null; district?: string | null; zone?: string | null }): string {
  return [loc.zone, loc.district, loc.city].filter(Boolean).join(", ");
}

export function getOrientationLabel(prop: PublicProperty): string {
  const dirs: string[] = [];
  if (prop.orientation_north) dirs.push("Norte");
  if (prop.orientation_south) dirs.push("Sur");
  if (prop.orientation_east) dirs.push("Este");
  if (prop.orientation_west) dirs.push("Oeste");
  return dirs.join(", ");
}
