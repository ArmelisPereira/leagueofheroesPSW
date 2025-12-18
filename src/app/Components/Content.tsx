"use client";

import { useHeroes } from "../Context/HeroesContext";
import HeroInfo from "./HeroInfo";
import Loader from "./Loader";

export default function Content() {
  const {
    top3,
    users,
    selectedUser,
    changeUser,       
    loadingUsers,
    loadingData,
  } = useHeroes();

  if (loadingUsers || loadingData) {
    return (
      <main className="main">
        <Loader />
      </main>
    );
  }

  return (
    <main className="main">
      <h2>Top Heróis Favoritos</h2>

      <div className="controls">
        <label>
          Utilizador Selecionado:{" "}
          <select
            value={selectedUser}
            onChange={(e) => changeUser(e.target.value)}
          >
            {users.map((u: any) => {
              const id = String(u.public_id ?? u.publicId ?? u.id ?? u);
              return (
                <option key={id} value={id}>
                  {u.name ?? id}
                </option>
              );
            })}
          </select>
        </label>
      </div>

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
    </main>
  );
}
