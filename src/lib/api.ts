// DreamScents API layer — localStorage-backed, mimics REST endpoints.
// Easy to swap to real Vercel /api routes later: just replace these functions with fetch() calls.

export type Category = "Rings" | "Necklaces" | "Earrings" | "Bracelets" | "Luxury";
export const CATEGORIES: Category[] = ["Rings", "Necklaces", "Earrings", "Bracelets", "Luxury"];

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: Category;
  description: string;
  image: string;
  createdAt: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: number;
}

const PERFUMES_KEY = "dreamgems.items";
const CONTACTS_KEY = "dreamgems.contacts";
const ORDERS_KEY = "dreamgems.orders";

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  qty: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: number;
}

const SEED: Perfume[] = [
  {
    id: "p1",
    name: "Rose Étoile Ring",
    brand: "Maison Lune",
    price: 245,
    category: "Rings",
    description: "A romantic rose-gold band set with a pink tourmaline and a whisper of pavé diamonds.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    createdAt: Date.now() - 9000000,
  },
  {
    id: "p2",
    name: "Velvet Pearl Necklace",
    brand: "Nuit d'Or",
    price: 420,
    category: "Necklaces",
    description: "Hand-knotted Akoya pearls on silk, finished with a warm 18k gold clasp.",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
    createdAt: Date.now() - 8000000,
  },
  {
    id: "p3",
    name: "Ocean Drop Earrings",
    brand: "Aqua Belle",
    price: 195,
    category: "Earrings",
    description: "Aquamarine teardrops suspended on whisper-thin white gold threads.",
    image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&q=80",
    createdAt: Date.now() - 7000000,
  },
  {
    id: "p4",
    name: "Sucre Charm Bracelet",
    brand: "Petite Rêve",
    price: 180,
    category: "Bracelets",
    description: "A delicate gold chain dusted with sugar-pink quartz and tiny star charms.",
    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
    createdAt: Date.now() - 6000000,
  },
  {
    id: "p5",
    name: "Couture Noir Tiara",
    brand: "Maison Lune",
    price: 1320,
    category: "Luxury",
    description: "Black diamonds and onyx set in white gold — opulence captured in a crown.",
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80",
    createdAt: Date.now() - 5000000,
  },
  {
    id: "p6",
    name: "Jasmine Halo Ring",
    brand: "Fleur Blanche",
    price: 360,
    category: "Rings",
    description: "A flower-shaped halo of moonstones around a single brilliant-cut diamond.",
    image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800&q=80",
    createdAt: Date.now() - 4000000,
  },
];

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeeded() {
  const existing = localStorage.getItem(PERFUMES_KEY);
  if (!existing) write(PERFUMES_KEY, SEED);
}

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((res) => setTimeout(() => res(value), ms));
}

function uid() {
  return "p_" + Math.random().toString(36).slice(2, 10);
}

// ===== GET /api/perfumes =====
export async function getPerfumes(): Promise<Perfume[]> {
  ensureSeeded();
  const list = read<Perfume[]>(PERFUMES_KEY, []);
  return delay([...list].sort((a, b) => b.createdAt - a.createdAt));
}

// ===== GET /api/perfumes/[id] =====
export async function getPerfume(id: string): Promise<Perfume | null> {
  ensureSeeded();
  const list = read<Perfume[]>(PERFUMES_KEY, []);
  return delay(list.find((p) => p.id === id) ?? null);
}

// ===== POST /api/perfumes =====
export async function createPerfume(
  data: Omit<Perfume, "id" | "createdAt">
): Promise<Perfume> {
  ensureSeeded();
  const list = read<Perfume[]>(PERFUMES_KEY, []);
  const created: Perfume = { ...data, id: uid(), createdAt: Date.now() };
  write(PERFUMES_KEY, [created, ...list]);
  return delay(created);
}

// ===== PUT /api/perfumes/[id] =====
export async function updatePerfume(
  id: string,
  data: Partial<Omit<Perfume, "id" | "createdAt">>
): Promise<Perfume | null> {
  ensureSeeded();
  const list = read<Perfume[]>(PERFUMES_KEY, []);
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return delay(null);
  const updated = { ...list[idx], ...data };
  list[idx] = updated;
  write(PERFUMES_KEY, list);
  return delay(updated);
}

// ===== DELETE /api/perfumes/[id] =====
export async function deletePerfume(id: string): Promise<boolean> {
  ensureSeeded();
  const list = read<Perfume[]>(PERFUMES_KEY, []);
  const next = list.filter((p) => p.id !== id);
  write(PERFUMES_KEY, next);
  return delay(next.length !== list.length);
}

// ===== POST /api/contact =====
export async function submitContact(
  data: Omit<ContactSubmission, "id" | "createdAt">
): Promise<ContactSubmission> {
  const list = read<ContactSubmission[]>(CONTACTS_KEY, []);
  const created: ContactSubmission = { ...data, id: uid(), createdAt: Date.now() };
  write(CONTACTS_KEY, [created, ...list]);
  return delay(created);
}

export async function getContacts(): Promise<ContactSubmission[]> {
  return delay(read<ContactSubmission[]>(CONTACTS_KEY, []));
}

// ===== GET /api/orders =====
export async function getOrders(): Promise<Order[]> {
  const list = read<Order[]>(ORDERS_KEY, []);
  return delay([...list].sort((a, b) => b.createdAt - a.createdAt));
}

// ===== POST /api/orders =====
export async function createOrder(
  data: Omit<Order, "id" | "createdAt">
): Promise<Order> {
  const list = read<Order[]>(ORDERS_KEY, []);
  const created: Order = { ...data, id: uid(), createdAt: Date.now() };
  write(ORDERS_KEY, [created, ...list]);
  return delay(created);
}

// ===== DELETE /api/orders/[id] =====
export async function deleteOrder(id: string): Promise<boolean> {
  const list = read<Order[]>(ORDERS_KEY, []);
  const next = list.filter((o) => o.id !== id);
  write(ORDERS_KEY, next);
  return delay(next.length !== list.length);
}

// ===== Restore a previously-deleted order (preserves id + createdAt) =====
export async function restoreOrder(order: Order): Promise<Order> {
  const list = read<Order[]>(ORDERS_KEY, []);
  if (list.some((o) => o.id === order.id)) return delay(order);
  write(ORDERS_KEY, [order, ...list]);
  return delay(order);
}