"use client";

import { useHeroes } from "@/app/Context/HeroesContext";
import { useEffect, useMemo, useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./form.css";

type HeroFormState = {
  id?: number;
  name: string;
  image: string;
  superpower: string;
};

export default function HeroFormClient() {
  const { heroes, saveHero, isOwner } = useHeroes();
  const router = useRouter();
  const searchParams = useSearchParams();

  const idParam = searchParams.get("id");
  const heroId = useMemo(() => (idParam ? Number(idParam) : null), [idParam]);

  const [hero, setHero] = useState<HeroFormState>({
    id: undefined,
    name: "",
    image: "",
    superpower: "",
  });

  const [msg, setMsg] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // carregar dados se for edição
  useEffect(() => {
    if (!heroId) return;

    const found = heroes.find((h: any) => Number(h.id) === heroId);
    if (!found) return;

    setHero({
      id: Number(found.id),
      name: found.name ?? "",
      image: found.image ?? "",
      superpower: found.superpower ?? "",
    });
  }, [heroId, heroes]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHero((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isOwner) {
      setMsg("Não podes editar dados de outro utilizador.");
      return;
    }

    setMsg("");
    setSaving(true);

    try {
      await saveHero({
        id: hero.id,
        name: hero.name,
        image: hero.image,
        superpower: hero.superpower,
      });

      setMsg("✅ Guardado com sucesso!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setMsg(`❌ Erro ao guardar: ${err?.message ?? "Erro desconhecido"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>{hero.id ? "Editar Super-Herói" : "Adicionar Super-Herói"}</h1>

      {!isOwner && (
        <p style={{ color: "crimson" }}>
          Estás a ver outro utilizador — não podes gravar alterações.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input name="name" value={hero.name} onChange={handleChange} required />

        <label>Imagem (URL):</label>
        <input name="image" value={hero.image} onChange={handleChange} required />

        <label>Superpoder:</label>
        <input
          name="superpower"
          value={hero.superpower}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={!isOwner || saving}>
          {saving ? "A guardar..." : "Gravar"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          style={{ marginLeft: "10px" }}
        >
          Voltar
        </button>
      </form>

      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
    </div>
  );
}
