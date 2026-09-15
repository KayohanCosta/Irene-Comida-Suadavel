import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/openrouter")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
          return Response.json(
            { error: "OPENROUTER_API_KEY is not configured on the server." },
            { status: 500 },
          );
        }

        try {
          const body = await request.json();
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://irenecomidasaudavel.com.br",
              "X-Title": "Irene Comida Saudavel",
            },
            body: JSON.stringify(body),
          });

          return new Response(await response.text(), {
            status: response.status,
            headers: {
              "Content-Type": response.headers.get("content-type") ?? "application/json",
            },
          });
        } catch {
          return Response.json({ error: "Failed to contact OpenRouter." }, { status: 502 });
        }
      },
    },
  },
});
