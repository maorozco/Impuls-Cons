import Image from 'next/image';
import { CSSProperties } from 'react';

/**
 * <BiocycleImage> — next/image wrapper that resolves a generated asset id to the
 * pair of WebP files emitted by scripts/optimize-biocycle-images.ts:
 *   /biocycle/img/<id>.webp   (standard DPR)
 *   /biocycle/img/<id>@2x.webp (retina — used as the src, browser downsamples)
 *
 * Drops a subtle scale-up fade-in via pure CSS so images don't flash in abruptly.
 * Honors prefers-reduced-motion automatically via the existing biocycle.css rule.
 */
export type BiocycleImageId =
  | 'hero-inicio'
  | 'path-lab'
  | 'path-biz'
  | 'featured-paper'
  | 'disenador-bg'
  | 'portal-refineria'
  | 'asesoria-corpus'
  | 'onboarding-welcome'
  | 'hero-disenador'
  | 'hero-descubrimientos';

interface Props {
  id: BiocycleImageId;
  alt: string;
  /** Render above-the-fold? If yes next/image gets `priority`. */
  priority?: boolean;
  /** Explicit render width/height in CSS px (used as the intrinsic size Next reads). */
  width: number;
  height: number;
  className?: string;
  style?: CSSProperties;
  /** Optional sizes attr for responsive rendering. */
  sizes?: string;
}

export function BiocycleImage({
  id,
  alt,
  priority = false,
  width,
  height,
  className,
  style,
  sizes,
}: Props) {
  // 2x asset is the source of truth (Next handles downscale via the `sizes` attr).
  const src = `/biocycle/img/${id}@2x.webp`;
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes ?? '(max-width: 768px) 100vw, 960px'}
      className={`bc-img ${className ?? ''}`}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}
