import { Suspense } from "react";
import { http } from "@/lib/fetch";
import RevalidateButton from "./_component/RevalidateButton";
import { Post } from "../api/posts/route";

export const dynamic = "force-dynamic";

async function Posts() {
  const posts = await http.getJSON<{
    data: Post[];
    meta: {
      timestamp: string;
      cache: {
        control: string | null;
        status: string | null;
      };
    };
  }>("http://localhost:3000/api/posts", {
    next: {
      tags: ["posts"],
      revalidate: 10,
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.data.map((post) => (
        <div
          key={post.id}
          className="rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-600">{post.body}</p>
          <p className="mt-2 text-sm text-gray-400">
            Last updated: {new Date(post.timestamp).toLocaleString("th-TH")}
          </p>
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
            <div className="h-4 w-4/6 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Posts</h1>
        <RevalidateButton />
      </div>
      <Suspense fallback={<LoadingSkeleton />}>
        <Posts />
      </Suspense>
    </div>
  );
}
