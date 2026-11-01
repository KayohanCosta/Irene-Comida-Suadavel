import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Irene Comida Saudável | Fortaleza</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" type="image/png" href="/favicon.png?v=2" />
        <link rel="canonical" href="https://irenecomidasaudavel.vercel.app/" />
        <meta name="application-name" content="Irene Comida Saudável" />
        <meta name="apple-mobile-web-app-title" content="Irene Comida Saudável" />
        <meta property="og:site_name" content="Irene Comida Saudável" />
        <meta property="og:title" content="Irene Comida Saudável | Fortaleza" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://irenecomidasaudavel.vercel.app/" />
        <link rel="stylesheet" href={appCss} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Irene Comida Saudável",
              alternateName: ["Irene Comida Saudavel", "Irene Saudável", "Irene Marmitas"],
              url: "https://irenecomidasaudavel.vercel.app/",
            }),
          }}
        />
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
