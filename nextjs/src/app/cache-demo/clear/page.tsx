import { revalidateTag } from "next/cache";

function ClearPage() {
  const clearCache = async () => {
    "use server";
    revalidateTag("pokemonList");
  };

  return (
    <div>
      <button type="button" onClick={clearCache}>
        Clear cache
      </button>
    </div>
  );
}

export default ClearPage;
