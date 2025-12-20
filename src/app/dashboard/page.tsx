"use client";

import Link from "next/link";
import { useHeroes } from "@/app/Context/HeroesContext";
import Loader from "@/app/Components/Loader";
import "./dashboard.css";

export default function Dashboard() {
  const {
    heroes,
    topIds,
    users,
    selectedUser,
    setSelectedUser,
    loadingUsers,
    loadingData,
    isOwner,
    removeHero,
    toggleFavorite,
  } = useHeroes();

  if (loadingUsers || loadingData) return <Loader />;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div style={{ marginBottom: 14 }}>
        <label>
          Utilizador Selecionado:{" "}
          <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            {users.map((u: any) => {
              const id = String(u?.public_id ?? u?.publicId ?? u?.id ?? u);
              return (
                <option key={id} value={id}>
                  {u?.name ? `${u.name} (${id})` : id}
                </option>
              );
            })}
          </select>
        </label>
      </div>

      <Link href="/heroes/form">
        <button disabled={!isOwner}>Adicionar Super-Herói</button>
      </Link>

      {!isOwner && (
        <p style={{ marginTop: 10, color: "#555" }}>
          Estás a ver dados de outro utilizador — ações bloqueadas.
        </p>
      )}

      <table className="heroes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Superpoder</th>
            <th>Favorito</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {heroes.map((hero) => (
            <tr key={hero.id}>
              <td>{hero.id}</td>
              <td>
                <img src={hero.image} width={50} height={50} alt={hero.name} />
              </td>
              <td>{hero.name}</td>
              <td>{hero.superpower?.trim() ? hero.superpower : "N/D"}</td>

              <td>
                <button
                  disabled={!isOwner}
                  onClick={() => toggleFavorite(hero.id)}
                  title="Favoritar/Desfavoritar"
                >
                  {topIds.includes(hero.id) ? "★" : "☆"}
                </button>
              </td>

              <td>
                <button disabled={!isOwner} onClick={() => removeHero(hero.id)}>
                  Eliminar
                </button>

                <Link href={`/heroes/form?id=${hero.id}`}>
                  <button disabled={!isOwner}>Editar</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
