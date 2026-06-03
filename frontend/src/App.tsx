import { Route, Routes } from "react-router";
import { LandingPage } from "./Pages/LandingPage";
import { Toaster } from "sonner";

function App() {

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-slate-900 text-white antialiased"
    >
      <Toaster
        theme="dark"
        position="top-right"
        closeButton
      />

      {/* {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-2xl text-white">
          Loading...
        </div>
      )} */}

      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />
      </Routes>
    </div>
  )
}

export default App;
