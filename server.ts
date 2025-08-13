import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import type { FilledContext } from "react-helmet-async";

const isProd = process.env.NODE_ENV === "production";
const __dirname = path.resolve();

async function createServer() {
  const app = express();

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
        const { appHtml, helmetContext } = render(url) as {
          appHtml: string;
          helmetContext: FilledContext;
        };
        const { helmet } = helmetContext;
        const html = template
          .replace("<!--app-html-->", appHtml)
          .replace(
            "<head>",
            `<head>${helmet?.title?.toString() ?? ""}${helmet?.meta?.toString() ?? ""}`
          );
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use("/assets", express.static(path.join(distPath, "client/assets")));

    app.use("*", async (req, res) => {
      const url = req.originalUrl;
      const template = fs.readFileSync(
        path.join(distPath, "client/index.html"),
        "utf-8"
      );
      const { render } = (await import(
        path.join(distPath, "server/entry-server.js")
      )) as {
        render: (url: string) => {
          appHtml: string;
          helmetContext: FilledContext;
        };
      };
      const { appHtml, helmetContext } = render(url);
      const { helmet } = helmetContext;
      const html = template
        .replace("<!--app-html-->", appHtml)
        .replace(
          "<head>",
          `<head>${helmet?.title?.toString() ?? ""}${helmet?.meta?.toString() ?? ""}`
        );
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    });
  }

  return app;
}

createServer().then((app) => {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`SSR server running at http://localhost:${port}`);
  });
});