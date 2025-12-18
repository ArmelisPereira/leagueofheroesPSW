import React from "react";
import "./HeroInfo.css";

interface HeroInfoProps {
  id: number;
  name: string;
  image: string;
  isFavorite?: boolean;
}

export default function HeroInfo({ name, image, isFavorite = false }: HeroInfoProps) {
  return (
    <div className={`hero-box ${isFavorite ? "favorite" : ""}`}>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      {isFavorite && <div className="badge">★ Favorito</div>}
    </div>
  );
}
