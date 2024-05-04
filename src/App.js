import "./App.css";
import { NextUIProvider } from "@nextui-org/react";
import Home from "./pages/Home";
import DailyLesson from "./components/DailyLesson";

function App() {
  return (
    <>
      <NextUIProvider>
        <Home />
        {/* <DailyLesson /> */}
      </NextUIProvider>
    </>
  );
}

export default App;
