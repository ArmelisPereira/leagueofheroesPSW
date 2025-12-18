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
  await fetch(`${BASE_URL}/users/${PRIVATE_ID}`, {
    method: "POST",
    headers,
    body: JSON.stringify(heroes),
  });
}

export async function saveFavorites(favorites) {
  await fetch(`${BASE_URL}/users/${PRIVATE_ID}/top`, {
    method: "POST",
    headers,
    body: JSON.stringify(favorites),
  });
}
