/* ================================================================
   Hero Components -- Barrel Export
   Ticket: ST-836 / REQ-046
   Ticket: ST-857 / REQ-057 (Animation Orchestrator)
   ================================================================ */

export { HeroHome, type HeroHomeProps } from "./hero-home";

// Animation orchestrator -- timeline constants, hook, and variant factories
export {
  HERO_TIMELINE,
  HERO_STAGE_DELAYS_S,
  HERO_STAGE_DURATIONS_S,
  HERO_SEQUENCE_DURATION_MS,
  HERO_SEQUENCE_DURATION_S,
  useHeroAnimation,
  useHeroAnimationComplete,
  createHeroFadeUp,
  createHeroFadeIn,
  createHeroSlideInRight,
  createHeroRouteDraw,
  createHeroWaypointContainer,
  createHeroWaypointDot,
  createHeroProgressBarTransition,
  createHeroGaugeTransition,
  createHeroStatusPulse,
  createHeroTripReadyBadge,
  type HeroStage,
  type HeroStageDelayMs,
  type HeroAnimationState,
  type HeroAnimationVariants,
  type UseHeroAnimationOptions,
} from "./hero-animation";
