"use client";

import { useHeroes } from "@/app/Context/HeroesContext";
import Link from "next/link";
import "./dashboard.css";

export default function Dashboard() {
  const { heroes, favorites, removeHero, toggleFavorite, isOwner, loadingData } = useHeroes();

  if (loadingData) return <p>A carregar...</p>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <Link href="/heroes/form">
        <button disabled={!isOwner}>Adicionar Super-Herói</button>
      </Link>

      {!isOwner && (
        <p style={{ marginTop: 10 }}>
          Estás a ver dados de outro utilizador — ações bloqueadas.
        </p>
      )}

      <table className="heroes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Superpower</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {heroes.map((hero: any) => {
            const isFav = favorites.some((f: any) => f.id === hero.id && f.favorite);

            return (
              <tr key={hero.id}>
                <td>{hero.id}</td>
                <td>
                  <img src={hero.image} width={50} height={50} alt={hero.name} />
                </td>
                <td>{hero.name}</td>
                <td>{hero.superpower}</td>
                <td>
                  <button disabled={!isOwner} onClick={() => removeHero(hero.id)}>
                    Eliminar
                  </button>

                  <button disabled={!isOwner} onClick={() => toggleFavorite(hero)}>
                    {isFav ? "Desfavoritar" : "Favoritar"}
                  </button>

                  <Link href={`/heroes/form?id=${hero.id}`}>
                    <button disabled={!isOwner}>Editar</button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
