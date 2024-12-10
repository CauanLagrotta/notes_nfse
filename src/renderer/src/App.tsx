import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes/router";
import "./App.css";

export function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}
