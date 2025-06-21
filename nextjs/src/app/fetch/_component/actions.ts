"use server";
import { revalidateTag } from "next/cache";

export async function revalidatePosts() {
  const timestamp = new Date().toISOString();

  revalidateTag("posts");

  return {
    revalidated: true,
    timestamp,
  };
}
