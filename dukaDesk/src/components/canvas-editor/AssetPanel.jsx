import { useRef, useCallback } from "react";

export default function AssetPanel({ assets, onAddAsset, onRemoveAsset }) {
  const fileRef = useRef(null);

  const handleFile = useCallback((files) => {
    if (!files || files.length === 0) return;
    [...files].forEach(f => onAddAsset(f));
  }, [onAddAsset]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.files) handleFile(e.dataTransfer.files);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleAssetDragStart = useCallback((e, asset) => {
    e.dataTransfer.setData("asset-url", asset.url);
    e.dataTransfer.setData("asset-name", asset.name);
    e.dataTransfer.effectAllowed = "copy";
  }, []);

  return (
    <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileRef.current?.click()}
        style={{
          border: "2px dashed #D1D5DB", borderRadius: 8, padding: 20,
          textAlign: "center", cursor: "pointer", fontSize: 11, color: "#9CA3AF",
          background: "#FAFAFA", transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#F4A026"; e.currentTarget.style.background = "#FFF8ED"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.background = "#FAFAFA"; }}
      >
        <div style={{ fontSize: 20, marginBottom: 4 }}>📁</div>
        <div>Drop images or click to upload</div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={e => handleFile(e.target.files)}
        />
      </div>
      {assets.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {assets.map(asset => (
            <div
              key={asset.id}
              draggable
              onDragStart={e => handleAssetDragStart(e, asset)}
              style={{
                position: "relative", borderRadius: 6, overflow: "hidden",
                aspectRatio: "1", background: "#F1EDEF", cursor: "grab",
                border: "1px solid #E5E7EB",
              }}
            >
              <img src={asset.url} alt={asset.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button
                onClick={(e) => { e.stopPropagation(); onRemoveAsset(asset.id); }}
                style={{
                  position: "absolute", top: 2, right: 2, width: 18, height: 18,
                  borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.5)",
                  color: "#fff", fontSize: 10, cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center", lineHeight: 1,
                }}
                title="Remove"
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
