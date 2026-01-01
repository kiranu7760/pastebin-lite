export const dynamic = "force-dynamic";

async function getPaste(id) {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/pastes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage(props) {
  const { id } = await props.params;

  const paste = await getPaste(id);

  if (!paste) {
    return <h1>Paste not found</h1>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <pre>{paste.content}</pre>
    </main>
  );
}
