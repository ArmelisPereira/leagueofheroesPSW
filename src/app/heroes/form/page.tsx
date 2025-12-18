"use client";

import { useHeroes } from "@/app/Context/HeroesContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import "./form.css";

export default function HeroForm() {
  const { heroes, saveHero, isOwner } = useHeroes();
  const router = useRouter();
  const searchParams = useSearchParams();

  const idParam = searchParams.get("id");

  const [hero, setHero] = useState({
    id: 0,
    name: "",
    image: "",
    superpower: "",
  });

  useEffect(() => {
    if (!idParam) return;

    const idNumber = Number(idParam);
    const found = heroes.find((h: any) => h.id === idNumber);

    if (found) {
      setHero({
        id: found.id,
        name: found.name ?? "",
        image: found.image ?? "",
        superpower: found.superpower ?? "",
      });
    }
  }, [idParam, heroes]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHero((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await saveHero(hero);
    router.push("/dashboard");
  };

  return (
    <div>
      <h1>{hero.id ? "Editar Super-Herói" : "Adicionar Super-Herói"}</h1>

      {!isOwner && <p>Estás a ver dados de outro utilizador — edição bloqueada.</p>}

      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input name="name" value={hero.name} onChange={handleChange} required />

        <label>Imagem (URL):</label>
        <input name="image" value={hero.image} onChange={handleChange} required />

        <label>Superpower:</label>
        <input
          name="superpower"
          value={hero.superpower}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={!isOwner}>
          Gravar
        </button>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          style={{ marginLeft: "10px" }}
        >
          Voltar
        </button>
      </form>
    </div>
  );
}
