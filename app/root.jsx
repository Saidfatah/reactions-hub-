import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "remix";
export function meta() {
  return { title: "New Remix App" };
}
import globalStylesUrl from "./styles/global.css";

// https://remix.run/api/app#links
export let links = () => {
  return [
    { rel: "stylesheet", href: globalStylesUrl },
  ];
};



export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
