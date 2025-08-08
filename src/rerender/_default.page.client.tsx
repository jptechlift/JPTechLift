import React from "react";
import ReactDOM from "react-dom/client";

export const clientRouting = true;
export const hydrationCanBeAborted = true;
export const passToClient = ["pageProps", "documentProps"];

// ✅ Không cần import gì thêm
export type PageContextClient = {
  Page: (props: Record<string, unknown>) => React.ReactElement;
  isHydration: boolean;
  pageProps?: Record<string, unknown>;
  documentProps?: {
    title?: string;
    description?: string;
    keywords?: string[] | string;
  };
};

export async function render(pageContext: PageContextClient) {
  const { Page, pageProps, documentProps } = pageContext;
  const container = document.getElementById("react-root")!;
  const app = <Page {...pageProps} />;

  if (pageContext.isHydration) {
    ReactDOM.hydrateRoot(container, app);
  } else {
    ReactDOM.createRoot(container).render(app);
  }

  if (documentProps?.title) document.title = documentProps.title;
  updateMeta("description", documentProps?.description);
  updateMeta(
    "keywords",
    Array.isArray(documentProps?.keywords)
      ? documentProps.keywords.join(", ")
      : documentProps?.keywords
  );
}

function updateMeta(name: string, content?: string) {
  if (!content) return;
  let tag = document.querySelector(`meta[name='${name}']`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}
