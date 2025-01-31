import { cache, storage } from "@/helpers/asyncCache";

export const GET = async () => {
  try {
    storage.run(cache, () => storage.getStore()?.delete("pokemonList"));
    return Response.json(null, { status: 200 });
  } catch {
    return Response.json("Failed to fetch data", { status: 500 });
  }
};
