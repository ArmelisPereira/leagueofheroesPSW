// src/app/Services/api.js
export const BASE_URL = "https://dwdm-psw-heroes-api.onrender.com/api";
export const PUBLIC_ID = "S2Eyy9py";
export const PRIVATE_ID = "iG5c09VeF3edcw2r";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// GET BASE_URL/users/
export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users/`, { method: "GET", headers });
  if (!res.ok) throw new Error(`Erro getUsers: ${res.status}`);
  return res.json();
}

// GET BASE_URL/users/:PUBLIC_ID
export async function getHeroes(publicId) {
  const res = await fetch(`${BASE_URL}/users/${publicId}`, { method: "GET", headers });
  if (!res.ok) throw new Error(`Erro getHeroes: ${res.status}`);
  return res.json();
}

// GET BASE_URL/users/:PUBLIC_ID/top
export async function getTopHeroes(publicId) {
  const res = await fetch(`${BASE_URL}/users/${publicId}/top`, { method: "GET", headers });
  if (!res.ok) throw new Error(`Erro getTopHeroes: ${res.status}`);
  return res.json();
}

// POST BASE_URL/users/:PRIVATE_ID  (guarda lista completa de heróis)
export async function saveHeroes(heroesArray) {
  const res = await fetch(`${BASE_URL}/users/${PRIVATE_ID}`, {
    method: "POST",
    headers,
    body: JSON.stringify(heroesArray),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Erro a guardar heróis: ${res.status} ${txt}`);
  }

  return res.json().catch(() => null);
}

// POST BASE_URL/users/:PRIVATE_ID/top  (guarda top por IDs)
export async function saveTopHeroes(topIdsArray) {
  const res = await fetch(`${BASE_URL}/users/${PRIVATE_ID}/top`, {
    method: "POST",
    headers,
    body: JSON.stringify(topIdsArray),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Erro a guardar favoritos (por ID): ${res.status} ${txt}`);
  }

  return res.json().catch(() => null);
}
