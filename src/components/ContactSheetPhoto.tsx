import { useId } from 'react';
import type { CSSProperties } from 'react';

type Props = {
  src: string;
  rect: readonly [number, number, number, number];
  alt: string;
  sourceWidth?: number;
  sourceHeight?: number;
  className?: string;
  style?: CSSProperties;
};

/** Render a single supplied contact-sheet panel. This does not add resolution. */
export function ContactSheetPhoto({ src, rect, alt, sourceWidth = 1536,
  sourceHeight = 1024, className = '', style }: Props) {
  const titleId = useId();
  const [x, y, width, height] = rect;
  const decorative = alt.trim().length === 0;
  return (
    <svg
      className={`contact-sheet-photo ${className}`}
      viewBox={`${x} ${y} ${width} ${height}`}
      width={width} height={height}
      preserveAspectRatio="xMidYMid slice"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-labelledby={decorative ? undefined : titleId}
      focusable="false"
      style={{ overflow: 'hidden', ...style }}
    >
      {!decorative && <title id={titleId}>{alt}</title>}
      <image href={src} width={sourceWidth} height={sourceHeight} />
    </svg>
  );
}
