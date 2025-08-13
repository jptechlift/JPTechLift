import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, type FilledContext } from "react-helmet-async";
import "./styles/fonts.scss";
import "./styles/index.scss";
import App from "./App";

export function render(url: string) {
  const helmetContext: FilledContext = {} as FilledContext;
  const appHtml = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <HelmetProvider context={helmetContext}>
        <App />
      </HelmetProvider>
    </StaticRouter>
  );
  return { appHtml, helmetContext };
}