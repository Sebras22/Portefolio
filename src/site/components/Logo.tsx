import { B_PATH, GLYPH_TRANSFORM, S_PATH } from './logoGlyphs'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={`logo${className ? ` ${className}` : ''}`} viewBox="4 24 96 52" aria-hidden="true" focusable="false">
      <g className="logo__s">
        <path transform={GLYPH_TRANSFORM} d={S_PATH} />
      </g>
      <g className="logo__b">
        <path transform={GLYPH_TRANSFORM} d={B_PATH} />
      </g>
      <circle className="logo__dot" cx="90" cy="70" r="6" />
    </svg>
  )
}

export function LogoBadge({ className }: { className?: string }) {
  return (
    <span className={`logo-badge${className ? ` ${className}` : ''}`}>
      <LogoMark />
    </span>
  )
}
