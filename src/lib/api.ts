// DreamScents API layer — localStorage-backed, mimics REST endpoints.
// Easy to swap to real Vercel /api routes later: just replace these functions with fetch() calls.

export type Category = "Floral" | "Oud" | "Fresh" | "Sweet" | "Luxury";
export const CATEGORIES: Category[] = ["Floral", "Oud", "Fresh", "Sweet", "Luxury"];

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

const PERFUMES_KEY = "dreamscents.perfumes";
const CONTACTS_KEY = "dreamscents.contacts";
const ORDERS_KEY = "dreamscents.orders";

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
    name: "Rose Étoile",
    brand: "Maison Lune",
    price: 145,
    category: "Floral",
    description: "A romantic bouquet of Bulgarian rose, peony and a whisper of vanilla musk.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    createdAt: Date.now() - 9000000,
  },
  {
    id: "p2",
    name: "Velvet Oud",
    brand: "Nuit d'Or",
    price: 220,
    category: "Oud",
    description: "Smoky oud wood wrapped in saffron, leather and warm amber resin.",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
    createdAt: Date.now() - 8000000,
  },
  {
    id: "p3",
    name: "Ocean Reverie",
    brand: "Aqua Belle",
    price: 95,
    category: "Fresh",
    description: "Crisp sea breeze, bergamot and white tea — a daydream by the shore.",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80",
    createdAt: Date.now() - 7000000,
  },
  {
    id: "p4",
    name: "Sucre Étoilé",
    brand: "Petite Rêve",
    price: 110,
    category: "Sweet",
    description: "Spun sugar, praline almond and a drizzle of caramel under starlight.",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800&q=80",
    createdAt: Date.now() - 6000000,
  },
  {
    id: "p5",
    name: "Couture Noir",
    brand: "Maison Lune",
    price: 320,
    category: "Luxury",
    description: "Black orchid, iris and rare oud — opulence captured in crystal.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
    createdAt: Date.now() - 5000000,
  },
  {
    id: "p6",
    name: "Jasmine Dream",
    brand: "Fleur Blanche",
    price: 130,
    category: "Floral",
    description: "Night-blooming jasmine, ylang ylang and a touch of sandalwood.",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80",
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