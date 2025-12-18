"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  PUBLIC_ID,
  getUsers,
  getHeroes,
  getFavorites,
  saveHeroes,
  saveFavorites,
} from "../Services/api";

type Hero = {
  id: number;
  name: string;
  image: string;
  superpower?: string;
};

type Favorite = {
  id: number;
  favorite: boolean;
};

const HeroesContext = createContext<any>(null);

export function HeroesProvider({ children }: { children: React.ReactNode }) {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [top3, setTop3] = useState<Hero[]>([]);

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>(String(PUBLIC_ID));

  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const isOwner = String(selectedUser) === String(PUBLIC_ID);

  // GET /users
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoadingUsers(true);
        const u = await getUsers();
        if (!cancelled) setUsers(Array.isArray(u) ? u : []);
      } catch (e) {
        console.error(e);
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // GET heroes + favorites
useEffect(() => {
  let cancelled = false;

  (async () => {
    try {
      setLoadingData(true);

      const [h, f] = await Promise.all([
        getHeroes(selectedUser),
        getFavorites(selectedUser),
      ]);

      const heroesClean: Hero[] = (Array.isArray(h) ? h : []).map((x: any) => ({
        id: Number(x.id),
        name: x.name ?? "",
        image: x.image ?? "",
        superpower: x.superpower ?? "",
      }));

      const favoritesClean =
        Array.isArray(f) && f.length > 0
          ? (f as any[]).map((x: any) => ({
              id: Number(x.id),
              favorite: Boolean(x.favorite),
            }))
          : heroesClean.map((hero) => ({ id: hero.id, favorite: false }));

      if (isOwner && (!Array.isArray(f) || f.length === 0)) {
        await saveFavorites(favoritesClean);
      }

      const top = heroesClean
        .filter((hero) => favoritesClean.some((ff) => ff.id === hero.id && ff.favorite))
        .slice(0, 3);

      if (!cancelled) {
        setHeroes(heroesClean);
        setFavorites(favoritesClean);
        setTop3(top);
      }
    } catch (e) {
      console.error(e);
      if (!cancelled) {
        setHeroes([]);
        setFavorites([]);
        setTop3([]);
      }
    } finally {
      if (!cancelled) setLoadingData(false);
    }
  })();

  return () => {
    cancelled = true;
  };
}, [selectedUser]);


  // ADD/EDIT hero
  const saveHero = async (hero: Partial<Hero>) => {
    if (!isOwner) return;

    let updatedHeroes: Hero[] = [];

    if (hero.id) {
      updatedHeroes = heroes.map((h) =>
        h.id === hero.id
          ? {
              ...h,
              ...hero,
              superpower: (hero as any).superpower ?? h.superpower ?? "",
            }
          : h
      );
      setHeroes(updatedHeroes);
      await saveHeroes(updatedHeroes);
    } else {
      const newId = Date.now();
      const newHero: Hero = {
        id: newId,
        name: hero.name ?? "",
        image: hero.image ?? "",
        superpower: (hero as any).superpower ?? "",
      };

      updatedHeroes = [...heroes, newHero];

      const updatedFavs: Favorite[] = [...favorites, { id: newId, favorite: false }];

      setHeroes(updatedHeroes);
      setFavorites(updatedFavs);

      await saveHeroes(updatedHeroes);
      await saveFavorites(updatedFavs);
    }

    const updatedTop = updatedHeroes
      .filter((h) => favorites.some((f) => f.id === h.id && f.favorite))
      .slice(0, 3);

    setTop3(updatedTop);
  };

  // DELETE hero
  const removeHero = async (id: number) => {
    if (!isOwner) return;

    const updatedHeroes = heroes.filter((h) => h.id !== id);
    const updatedFavs = favorites.filter((f) => f.id !== id);

    setHeroes(updatedHeroes);
    setFavorites(updatedFavs);

    await saveHeroes(updatedHeroes);
    await saveFavorites(updatedFavs);

    const updatedTop = updatedHeroes
      .filter((h) => updatedFavs.some((f) => f.id === h.id && f.favorite))
      .slice(0, 3);

    setTop3(updatedTop);
  };

  // TOGGLE favorite
const toggleFavorite = async (hero: Hero) => {
  if (!isOwner) return;

  const exists = favorites.some((f) => f.id === hero.id);

  const updatedFavs = exists
    ? favorites.map((f) =>
        f.id === hero.id ? { ...f, favorite: !f.favorite } : f
      )
    : [...favorites, { id: hero.id, favorite: true }];

  setFavorites(updatedFavs);
  await saveFavorites(updatedFavs); // ✅ ENVIA PARA API /top

  const updatedTop = heroes
    .filter((h) => updatedFavs.some((f) => f.id === h.id && f.favorite))
    .slice(0, 3);

  setTop3(updatedTop);
};



  const value = useMemo(
    () => ({
      heroes,
      favorites,
      top3,
      users,
      selectedUser,
      setSelectedUser,
      loadingUsers,
      loadingData,
      isOwner,
      saveHero,
      removeHero,
      toggleFavorite,
    }),
    [heroes, favorites, top3, users, selectedUser, loadingUsers, loadingData, isOwner]
  );

  return <HeroesContext.Provider value={value}>{children}</HeroesContext.Provider>;
}

export function useHeroes() {
  const ctx = useContext(HeroesContext);
  if (!ctx) throw new Error("useHeroes tem de estar dentro de <HeroesProvider>");
  return ctx;
}
