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

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // carregar para edição
  useEffect(() => {
    if (!idParam) return;

    const idNumber = Number(idParam);
    const found = heroes.find((h: any) => Number(h.id) === idNumber);

    if (found) {
      setHero({
        id: Number(found.id),
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    setSaving(true);
    setMsg("");

    try {
      await saveHero(hero);
      setMsg("✅ Guardado com sucesso!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setMsg(`❌ Erro ao guardar: ${err?.message ?? "desconhecido"}`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>{hero.id ? "Editar Super-Herói" : "Adicionar Super-Herói"}</h1>

      {!isOwner && (
        <p style={{ color: "gray" }}>
          Estás a ver dados de outro utilizador. Não podes criar/editar.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input
          name="name"
          value={hero.name}
          onChange={handleChange}
          required
          disabled={!isOwner || saving}
        />

        <label>Imagem (URL):</label>
        <input
          name="image"
          value={hero.image}
          onChange={handleChange}
          required
          disabled={!isOwner || saving}
        />

        <label>Superpoder:</label>
        <input
          name="superpower"
          value={hero.superpower}
          onChange={handleChange}
          required
          disabled={!isOwner || saving}
        />

        <button type="submit" disabled={!isOwner || saving}>
          {saving ? "A guardar..." : "Gravar"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          style={{ marginLeft: "10px" }}
          disabled={saving}
        >
          Voltar
        </button>
      </form>

      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
    </div>
  );
}
