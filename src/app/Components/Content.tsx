"use client";

import { useHeroes } from "../Context/HeroesContext";
import HeroInfo from "./HeroInfo";
import Loader from "./Loader";

export default function Content() {
  const {
    top3,
    users,
    selectedUser,
    setSelectedUser,
    loadingUsers,
    loadingData,
  } = useHeroes();

  return (
    <main className="main">
      <h2>Top Heróis Favoritos</h2>

      {loadingUsers ? (
        <Loader />
      ) : (
        <div className="controls">
          <label>
            Utilizador Selecionado:{" "}
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
              {users.map((u: any) => {
                const id = String(u.public_id ?? u.id ?? u);
                return (
                  <option key={id} value={id}>
                    {id}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      )}

      {loadingData ? (
        <Loader />
      ) : (
        <div className="heroes-container">
          {top3.length === 0 ? (
            <p>Este utilizador não tem favoritos.</p>
          ) : (
            top3.map((hero: any) => (
              <HeroInfo
                key={hero.id}
                id={hero.id}
                name={hero.name}
                image={hero.image}
                isFavorite
              />
            ))
          )}
        </div>
      )}
    </main>
  );
}
