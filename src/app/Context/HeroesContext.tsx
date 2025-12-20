"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  PUBLIC_ID,
  getUsers,
  getHeroes,
  getTopHeroes,
  saveHeroes,
  saveTopHeroes,
} from "../Services/api";

export type Hero = {
  id: number;
  name: string;
  image: string;
  superpower?: string;
};

type HeroesContextType = {
  heroes: Hero[];
  topIds: number[];
  users: any[];
  selectedUser: string;
  setSelectedUser: (id: string) => void;
  loadingUsers: boolean;
  loadingData: boolean;
  isOwner: boolean;

  saveHero: (hero: Partial<Hero>) => Promise<void>;
  removeHero: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
};

const HeroesContext = createContext<HeroesContextType | null>(null);

function normalizeUsers(u: any): any[] {
  return Array.isArray(u) ? u : [];
}

function getUserPublicId(u: any): string {
  // tenta várias chaves possíveis (depende do backend)
  return String(u?.public_id ?? u?.publicId ?? u?.id ?? u);
}

function normalizeHeroes(h: any): Hero[] {
  const arr = Array.isArray(h) ? h : [];
  return arr.map((x: any) => ({
    id: Number(x.id),
    name: x.name ?? "",
    image: x.image ?? "",
    superpower: x.superpower ?? "",
  }));
}

function normalizeTop(top: any): number[] {
  const arr = Array.isArray(top) ? top : [];
  // pode vir [1,2,3] ou [{id:1}, {id:2}...]
  const ids = arr
    .map((x: any) => (typeof x === "number" ? x : Number(x?.id)))
    .filter((n: any) => Number.isFinite(n));

  // unique + max 3
  return Array.from(new Set(ids)).slice(0, 3);
}

export function HeroesProvider({ children }: { children: React.ReactNode }) {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [topIds, setTopIds] = useState<number[]>([]);

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>(String(PUBLIC_ID));

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  const isOwner = String(selectedUser) === String(PUBLIC_ID);

  // ✅ carregar users
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoadingUsers(true);
        const u = await getUsers();
        if (!cancelled) setUsers(normalizeUsers(u));
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

  // ✅ carregar heroes + top do selectedUser (colegas incluídos)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoadingData(true);

        const [h, t] = await Promise.all([getHeroes(selectedUser), getTopHeroes(selectedUser)]);

        const heroesClean = normalizeHeroes(h);
        const topClean = normalizeTop(t).filter((id) => heroesClean.some((hh) => hh.id === id));

        if (!cancelled) {
          setHeroes(heroesClean);
          setTopIds(topClean);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setHeroes([]);
          setTopIds([]);
        }
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedUser]);

  // ✅ add/edit hero (só owner)
  const saveHero = async (hero: Partial<Hero>) => {
    if (!isOwner) return;

    let updatedHeroes: Hero[];

    if (hero.id) {
      updatedHeroes = heroes.map((h) =>
        h.id === hero.id
          ? {
              ...h,
              ...hero,
              superpower: hero.superpower ?? h.superpower ?? "",
            }
          : h
      );
    } else {
      const newId = Date.now();
      updatedHeroes = [
        ...heroes,
        {
          id: newId,
          name: hero.name ?? "",
          image: hero.image ?? "",
          superpower: hero.superpower ?? "",
        },
      ];
    }

    setHeroes(updatedHeroes);
    await saveHeroes(updatedHeroes);

    // mantém top válido
    const cleanedTop = topIds.filter((id) => updatedHeroes.some((h) => h.id === id)).slice(0, 3);
    if (cleanedTop.length !== topIds.length) {
      setTopIds(cleanedTop);
      await saveTopHeroes(cleanedTop);
    }
  };

  // ✅ delete hero (só owner)
  const removeHero = async (id: number) => {
    if (!isOwner) return;

    const updatedHeroes = heroes.filter((h) => h.id !== id);
    const updatedTop = topIds.filter((x) => x !== id);

    setHeroes(updatedHeroes);
    setTopIds(updatedTop);

    await saveHeroes(updatedHeroes);
    await saveTopHeroes(updatedTop);
  };

  // ✅ toggle favorito por ID (só owner) — guarda só IDs no /top
  const toggleFavorite = async (id: number) => {
    if (!isOwner) return;

    let updatedTop: number[];

    if (topIds.includes(id)) {
      updatedTop = topIds.filter((x) => x !== id);
    } else {
      updatedTop = [...topIds, id].slice(0, 3);
    }

    setTopIds(updatedTop);
    await saveTopHeroes(updatedTop);
  };

  const value = useMemo(
    () => ({
      heroes,
      topIds,
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
    [heroes, topIds, users, selectedUser, loadingUsers, loadingData, isOwner]
  );

  return <HeroesContext.Provider value={value}>{children}</HeroesContext.Provider>;
}

export function useHeroes() {
  const ctx = useContext(HeroesContext);
  if (!ctx) throw new Error("useHeroes tem de estar dentro de <HeroesProvider>");
  return ctx;
}
