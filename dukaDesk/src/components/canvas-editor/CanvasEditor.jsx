import { useNavigate } from "react-router-dom";
import { useDesignStore } from "./DesignStore";
import SectionEditor from "../section-editor/SectionEditor";

export default function CanvasEditor() {
  const navigate = useNavigate();
  const store = useDesignStore(null);

  return <SectionEditor store={store} onBack={() => navigate("/dashboard")} />;
}