export const dynamic = "force-dynamic";

async function fetchPaste(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage({ params }) {
  const { id } = params;

  const data = await fetchPaste(id);

  if (!data) {
    return (
      <main style={{ padding: "20px" }}>
        <h2>Paste not found</h2>
      </main>
    );
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>Paste</h1>
      <pre
        style={{
          background: "#f4f4f4",
          padding: "15px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {data.content}
      </pre>
    </main>
  );
}
