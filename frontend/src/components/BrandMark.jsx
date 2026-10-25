export default function BrandMark() {
  // A weight plate seen from the front
  return (
    <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="currentColor" />
      <circle
        cx="16"
        cy="16"
        r="10"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <circle cx="16" cy="16" r="3.5" fill="#fff" />
    </svg>
  )
}
