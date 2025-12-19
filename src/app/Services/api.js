export const BASE_URL = "https://dwdm-psw-heroes-api.onrender.com/api";
export const PUBLIC_ID = "S2Eyy9py";
export const PRIVATE_ID = "iG5c09VeF3edcw2r";

const headers = { "Content-Type": "application/json" };

// -------- USERS --------
export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Erro GET /users: ${res.status}`);
  return res.json();
}

// -------- HEROES --------
export async function getHeroes(publicId) {
  const res = await fetch(`${BASE_URL}/heroes/${publicId}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Erro GET /heroes/${publicId}: ${res.status}`);
  return res.json();
}

// Guarda a lista inteira de heróis (API desta cadeira)
export async function saveHeroes(heroes) {
  const res = await fetch(`${BASE_URL}/users/${PRIVATE_ID}`, {
    method: "POST",
    headers,
    body: JSON.stringify(heroes),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Erro a guardar heróis: ${res.status} ${txt}`);
  }

  return res.json().catch(() => null);
}

// -------- FAVORITES (TOP) --------
export async function getFavorites(publicId) {
  const res = await fetch(`${BASE_URL}/top/${publicId}`, { cache: "no-store" });

  // algumas versões da API podem devolver 404 quando ainda não existe top
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Erro GET /top/${publicId}: ${res.status}`);

  return res.json();
}

// Guarda a lista inteira de favoritos (id + favorite)
export async function saveFavorites(favorites) {
  const res = await fetch(`${BASE_URL}/top/${PRIVATE_ID}`, {
    method: "POST",
    headers,
    body: JSON.stringify(favorites),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Erro a guardar favoritos: ${res.status} ${txt}`);
  }

  return res.json().catch(() => null);
}
