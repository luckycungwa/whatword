import "./App.css";
import { NextUIProvider } from "@nextui-org/react";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <NextUIProvider>
        <Home />
      </NextUIProvider>
    </>
  );
}

export default App;
