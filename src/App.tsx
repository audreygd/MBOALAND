import "./App.css";
import { apps } from "./appData";

export default function App() {
  return (
    <div className="selector-shell">
      <header className="selector-hero">
        <img src="favicon.png" alt="logo" height={"100px"} />
        <h1>Choisissez votre application</h1>
        <p className="lead">
          Ouvrez une application et commencez à travailler.
        </p>
      </header>

      <div className="app-grid">
        {apps.map((app) => (
          <a className="app-card" key={app.id} href={app.href}>
            <div>
              <h2>{app.name}</h2>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
