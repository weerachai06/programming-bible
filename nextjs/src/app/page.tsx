import Link from "next/link";

const REACT_DESIGN_PATTERNS = [
  {
    name: "Observable pattern",
    description:
      "A pattern that allows you to subscribe to changes in an object and get notified when the object changes.",
    link: "/observable-pattern",
  },
  {
    name: "Performance Comparison",
    description:
      "Compare different optimization techniques: No optimization vs CSS content-visibility vs Windowing technique for large lists.",
    link: "/performance-comparison",
  },
  {
    name: "Security Test Page",
    description:
      "⚠️ WARNING: Contains intentional security vulnerabilities for CodeQL testing. DO NOT use in production!",
    link: "/security-test",
  },
] as const;

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 font-(family-name:--font-geist-sans)">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          👋 Welcome to example for React design patterns
        </h1>

        <h4 className="text-lg text-center sm:text-left border-l-4 border-solid pl-4">
          This is a collection of examples for React design patterns.
        </h4>

        <div className="flex flex-col gap-2 w-full">
          {REACT_DESIGN_PATTERNS.map((pattern) => (
            <div
              key={pattern.link}
              className="flex flex-col gap-4 border-2 border-solid border-stone-900 p-2 rounded-xs w-full"
            >
              <Link
                href={pattern.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-center sm:text-left text-gray-700"
              >
                👉 {pattern.name}
              </Link>
              <p className="text-sm text-center sm:text-left text-gray-500">
                {pattern.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
