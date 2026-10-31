import Link from "next/link";
import { CocError } from "@/lib/coc";

export function ErrorBox({ error }: { error: unknown }) {
  const message =
    error instanceof CocError
      ? error.message
      : "Something went wrong while loading this page.";

  return (
    <div className="panel error" role="alert">
      <h2>Could not load data</h2>
      <p>{message}</p>
      <Link className="button" href="/">
        Back to search
      </Link>
    </div>
  );
}
