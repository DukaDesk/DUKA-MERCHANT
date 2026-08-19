import { useNavigate, useSearchParams } from "react-router-dom";
import { useDesignStore, getDefaultData } from "./DesignStore";
import SectionEditor from "../section-editor/SectionEditor";

export default function CanvasEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isBlank = searchParams.get("blank") === "1";
  const store = useDesignStore(isBlank ? getDefaultData() : null, { deferSave: isBlank });

  return <SectionEditor store={store} onBack={() => navigate("/dashboard")} />;
}