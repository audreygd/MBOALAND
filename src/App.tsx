import "./App.css";
import { apps } from "./appData";

export default function App() {
  return (
    <div className="selector-shell">
      <header className="selector-hero">
        <span className="eyebrow">MBOALAND</span>
        <h1>Choose your application</h1>
        <p className="lead">
          Open the role-based portal you want to work in. Every card loads the
          corresponding app and shows the current status.
        </p>
      </header>

      <div className="app-grid">
        {apps.map((app) => (
          <a className="app-card" key={app.id} href={app.href}>
            <div>
              <span className="status-pill">{app.status}</span>
              <h2>{app.name}</h2>
              <p>{app.description}</p>
            </div>
            <span className="app-action">Open {app.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
