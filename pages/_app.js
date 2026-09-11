import "../styles/globals.css";

// Every Next.js project has one top-level "App" component.
// Its only job here is to load our global stylesheet once,
// so every page can use the CSS variables and classes in it.
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
