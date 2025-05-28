import { useEffect, useRef, useState } from "react";
import Experience from "./Experience/Experience";
import "./styles/loader.css";

const App = () => {
  const canvasRef = useRef();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const experience = new Experience(canvasRef.current);

    const handleProgress = (e) => setProgress(e.detail);
    const handleComplete = () => {
      setTimeout(() => setLoading(false), 1000); // Espera un poco para el fade
    };

    window.addEventListener("resource-progress", handleProgress);
    window.addEventListener("resource-complete", handleComplete);

    return () => {
      window.removeEventListener("resource-progress", handleProgress);
      window.removeEventListener("resource-complete", handleComplete);
    };
  }, []);

  return (
    <>
      {loading && (
        <div
          id="loader-overlay"
          style={{
            opacity: loading ? 1 : 0,
            pointerEvents: loading ? "auto" : "none",
          }}
        >
          <div id="loader-bar" style={{ width: `${progress}%` }} />
          <div id="loader-text">Cargando... {progress.toFixed(0)}%</div>
        </div>
      )}

      <canvas ref={canvasRef} className="webgl" />
    </>
  );
};

export default App;
