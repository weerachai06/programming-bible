import React from "react";
// import { unstable_cache as cache } from "next/cache";

interface Pokemon {
  name: string;
  url: string;
}

interface PokenInternalInterface {
  data: Pokemon[];
  uuid: string;
}

export const dynamic = "force-dynamic";

const getPokemonList = async (): Promise<PokenInternalInterface> => {
  const url = new URL("/api", "http://localhost:3000").toString();
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

// const getCachedPokemonList = cache(getPokemonList, ["pokemonList"], {
//   revalidate: 10,
//   tags: ["pokemonList"],
// });

async function MyPage() {
  const data = await getPokemonList();

  return (
    <div>
      <p>UUID: {data.uuid}</p>
      <ul>
        {data.data.map((item) => (
          <li key={item.name}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default MyPage;
