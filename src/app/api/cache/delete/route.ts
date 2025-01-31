import { performantCache } from "@/helpers/asyncCache";

export const GET = async () => {
  try {
    performantCache.storage.run(performantCache.cache, () =>
      performantCache.storage.getStore()?.delete("pokemonList")
    );

    return Response.json(null, { status: 200 });
  } catch {
    return Response.json("Failed to fetch data", { status: 500 });
  }
};
