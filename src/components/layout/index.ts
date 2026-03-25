/**
 * ST-816: REQ-033 -- Layout Components
 * ST-817: REQ-034 -- SiteHeader / Navigation
 * ST-818: REQ-035 -- SiteFooter
 *
 * Re-exports for the foundational layout primitives used to structure
 * every marketing page:
 *
 * - `SiteHeader` -- sticky glassmorphic header with desktop/mobile nav.
 * - `SiteFooter` -- global 4-column footer on dark surface.
 * - `SectionContainer` -- full-width section with background variant and
 *   responsive vertical padding.
 * - `Container` -- content-width wrapper with responsive horizontal padding
 *   and configurable max-width.
 */
export { SiteHeader } from "./site-header";

export { SiteFooter } from "./site-footer";

export {
  SectionContainer,
  sectionContainerVariants,
  type SectionContainerProps,
} from "./section-container";

export {
  Container,
  containerVariants,
  type ContainerProps,
} from "./container";
