import { NextResponse } from "next/server";
import { headers } from "next/headers";

export interface Post {
  id: number;
  title: string;
  body: string;
  timestamp: string;
}

const generateMockPosts = (length: number) => {
  return Array.from({ length }, (_, i) => ({
    id: i + 1,
    title: `Post ${Math.random().toString(36).substring(7)}`,
    body: `This is the body of post ${i + 1}`,
    timestamp: new Date().toISOString(),
  }));
};

export async function GET() {
  const headersList = await headers();

  console.log("Missed cache");

  return NextResponse.json(
    {
      data: generateMockPosts(20),
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
