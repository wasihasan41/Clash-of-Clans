"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="panel error" role="alert">
      <h2>Something went wrong</h2>
      <p>An unexpected error happened while loading this page.</p>
      {error.digest && <p className="muted">Error code: {error.digest}</p>}
      <button className="button" type="button" onClick={reset}>
        Try again
      </button>{" "}
      <Link className="button" href="/">
        Back to search
      </Link>
    </div>
  );
}