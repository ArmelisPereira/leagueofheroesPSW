export const BASE_URL = "https://dwdm-psw-heroes-api.onrender.com/api";
export const PUBLIC_ID = "S2Eyy9py";
export const PRIVATE_ID = "iG5c09VeF3edcw2r";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function parse(res) {
  const data = await res.json();
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return data;
}

export async function getUsers() {
  return parse(await fetch(`${BASE_URL}/users/`));
}

export async function getHeroes(publicId = PUBLIC_ID) {
  return parse(await fetch(`${BASE_URL}/users/${publicId}`));
}

export async function getFavorites(publicId = PUBLIC_ID) {
  return parse(await fetch(`${BASE_URL}/users/${publicId}/top`));
}

export async function saveHeroes(heroes) {
  const res = await fetch(`${BASE_URL}/users/${PRIVATE_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(heroes),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Erro a guardar heróis: ${res.status} ${txt}`);
  }

  return res.json().catch(() => null);
}


export async function saveFavoriteById(id, favorite) {
  const res = await fetch(`${BASE_URL}/top/${PRIVATE_ID}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, favorite }),
  });

  if (!res.ok) throw new Error("Erro ao guardar favorito (por ID)");
  return res.json();
}

