/**
 * BeltStrip — representação visual de um cinto de taekwondo.
 * Cintos intermédios mostram uma lista central da cor seguinte.
 * Com vertical=true, a tira é renderizada em sentido vertical (troca width/height e flex-direction).
 */
export function BeltStrip({
  color,
  stripe,
  width = 52,
  height = 11,
  vertical = false,
}: {
  color: string;
  stripe?: string;
  width?: number;
  height?: number;
  vertical?: boolean;
}) {
  const renderWidth  = vertical ? height : width;
  const renderHeight = vertical ? width  : height;
  const isLight = color === "#C9CDD4";
  return (
    <div
      className="shrink-0 rounded-full overflow-hidden"
      style={{
        width: renderWidth,
        height: renderHeight,
        flexShrink: 0,
        display: "flex",
        flexDirection: vertical ? "column" : "row",
        border: isLight ? "1px solid rgba(156,163,175,0.35)" : "none",
        boxSizing: "border-box",
      }}
    >
      {stripe ? (
        <>
          <div style={{ flex: 5, background: color }} />
          <div style={{ flex: 2, background: stripe }} />
          <div style={{ flex: 5, background: color }} />
        </>
      ) : (
        <div style={{ flex: 1, background: color }} />
      )}
    </div>
  );
}
