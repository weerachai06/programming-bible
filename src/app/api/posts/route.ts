import { NextResponse } from "next/server";
import { headers } from "next/headers";

export interface Post {
  id: number;
  title: string;
  body: string;
  timestamp: string;
}

const MOCK_POSTS: Post[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Post ${Math.random().toString(36).substring(7)}`,
  body: `This is the body of post ${i + 1}`,
  timestamp: new Date().toISOString(),
}));

export async function GET() {
  const headersList = await headers();

  console.log("Missed cache");

  return NextResponse.json(
    {
      data: MOCK_POSTS,
      meta: {
        timestamp: new Date().toISOString(),
        cache: {
          control: headersList.get("cache-control"),
          status: headersList.get("x-vercel-cache"),
        },
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
      },
    }
  );
}
