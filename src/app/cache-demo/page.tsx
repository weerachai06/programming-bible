import { PerformantCache } from "@/helpers/asyncCache";
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

const performantCache = new PerformantCache({ maxSize: 10, ttl: 1000 * 60 });

const getPokemonList = async (): Promise<PokenInternalInterface> => {
  console.log("Fetching data");
  const res = await fetch("https://pokeapi.co/api/v2/pokemon");
  const data = await res.json();
  console.log({ data });

  return {
    data: data.results,
    uuid: Math.random().toString(36).substring(7, 14),
  };
};

const getPokemonListCached = async () => {
  return performantCache.storage.run(performantCache.cache, () =>
    performantCache.withCache("pokemonList", getPokemonList)
  );
};

async function MyPage() {
  const data = await getPokemonListCached();

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
