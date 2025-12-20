"use client";

import { useHeroes } from "@/app/Context/HeroesContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import "./form.css";

export default function HeroForm() {
  const { heroes, saveHero, isOwner } = useHeroes();
  const router = useRouter();
  const searchParams = useSearchParams();

  const idParam = searchParams.get("id");
  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const [hero, setHero] = useState({
    id: 0,
    name: "",
    image: "",
    superpower: "",
  });

  useEffect(() => {
    if (idParam) {
      const idNumber = Number(idParam);
      const found = heroes.find((h) => h.id === idNumber);
      if (found) {
        setHero({
          id: found.id,
          name: found.name,
          image: found.image,
          superpower: found.superpower ?? "",
        });
      }
    }
  }, [idParam, heroes]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHero({ ...hero, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!isOwner) {
      setErr("Não podes editar dados de outro utilizador.");
      return;
    }

    try {
      await saveHero(hero.id ? hero : { name: hero.name, image: hero.image, superpower: hero.superpower });
      setMsg("✅ Guardado com sucesso!");
      router.push("/dashboard");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Erro ao guardar.");
    }
  };

  return (
    <div className="form-page">
      <h1>{hero.id ? "Editar Super-Herói" : "Adicionar Super-Herói"}</h1>

      <form onSubmit={handleSubmit} className="form-card">
        <label>Nome:</label>
        <input name="name" value={hero.name} onChange={handleChange} required />

        <label>Imagem (URL):</label>
        <input name="image" value={hero.image} onChange={handleChange} required />

        <label>Superpoder:</label>
        <input name="superpower" value={hero.superpower} onChange={handleChange} />

        <div className="form-actions">
          <button type="submit" disabled={!isOwner}>Gravar</button>
          <button type="button" onClick={() => router.push("/dashboard")}>Voltar</button>
        </div>

        {msg && <p style={{ color: "green", marginTop: 10 }}>{msg}</p>}
        {err && <p style={{ color: "crimson", marginTop: 10 }}>❌ {err}</p>}
      </form>
    </div>
  );
}
