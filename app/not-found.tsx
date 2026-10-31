import Link from "next/link";

export default function NotFound() {
  return (
    <div className="panel">
      <h1>Page not found</h1>
      <p>That page does not exist. Check the link or go back to search.</p>
      <Link className="button" href="/">
        Back to search
      </Link>
    </div>
  );
}