import { buttonVariants } from "@/features/shared/components/button";
import { COLORS } from "@/features/shared/constants/flash-update";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ul className="fixed left-2 top-10">
        <li className=" text-gray-700 text-base mb-2">Meaning of colors</li>

        <li
          className={"text-xs flex max-w-48 items-center gap-2 text-gray-500"}
        >
          <span
            className={[COLORS.RERENDER_BG, "w-4 h-4 inline-block"].join(" ")}
            aria-hidden
          />{" "}
          - <span className="align-middle">Re-Render</span>
        </li>
      </ul>

      {children}

      <footer className="fixed bottom-2 right-2 text-xs text-gray-500">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ size: "sm" })}
        >
          Go to home page
        </a>
      </footer>
    </>
  );
}
