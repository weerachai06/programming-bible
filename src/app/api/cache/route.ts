import { performantCache } from "@/helpers/asyncCache";
const CACHE_KEY = "pokemonList";

const fetchPokemon = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon");
  const data = await res.json();

  return {
    data: data.results,
    uuid: Math.random().toString(36).substring(7, 14),
  };
};

export async function GET() {
  try {
    const data = await performantCache.storage.run(performantCache.cache, () =>
      performantCache.withCache(CACHE_KEY, fetchPokemon)
    );

    return Response.json(data);
  } catch {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
