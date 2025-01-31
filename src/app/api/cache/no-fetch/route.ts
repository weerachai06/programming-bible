import { cache, storage } from "@/helpers/asyncCache";

export const GET = async () => {
  const data = storage.run(cache, () => storage.getStore());

  const pokemon = data?.get("pokemonList");

  if (pokemon) {
    return Response.json(pokemon.data);
  }
  return Response.json("Failed to fetch data", { status: 500 });
};
