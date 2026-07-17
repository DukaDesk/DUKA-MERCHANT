import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDesignStore } from "./DesignStore";
import templateDefaults from "./templateDefaults";
import SectionEditor from "../section-editor/SectionEditor";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { SetupWizard } from "../app-builder/SetupWizard";

export default function CanvasEditor() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const store = useDesignStore(null);

  const [setupComplete, setSetupComplete] = useState(false);

  const handleEnterEditor = useCallback((data) => {
    const defaults = templateDefaults[data.template] || templateDefaults.Custom;
    store.loadTemplate(defaults);
    store.setMeta({
      appName: data.appName || defaults.meta.appName,
      category: data.category,
      primaryColor: data.color,
      logo: data.logo,
    });
    setSetupComplete(true);
  }, [store]);

  const handleSkipToEditor = useCallback((data) => {
    const defaults = templateDefaults.Custom;
    store.loadTemplate(defaults);
    store.setMeta({
      appName: defaults.meta.appName,
      category: data.category,
      primaryColor: "#1A1A2E",
      logo: null,
    });
    setSetupComplete(true);
  }, [store]);

  if (!setupComplete) {
    return (
      <SetupWizard
        onComplete={handleEnterEditor}
        onSkipToEditor={handleSkipToEditor}
        sidebarStyle="canvas"
        title="DukaDesk"
        subtitle="App Builder"
        isMobile={isMobile}
      />
    );
  }

  return <SectionEditor store={store} onBack={() => navigate("/dashboard")} />;
}