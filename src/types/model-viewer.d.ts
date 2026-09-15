import type * as React from "react";

/**
 * JSX tipizacija spletnega gradnika <model-viewer> (@google/model-viewer)
 * za React 19. Pripadajoči element registrira dinamični uvoz v
 * src/components/museum/model-3d-view.tsx.
 */
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        "ios-src"?: string;
        poster?: string;
        alt?: string;
        "camera-controls"?: boolean;
        ar?: boolean;
        "ar-modes"?: string;
        "ar-scale"?: string;
        "auto-rotate"?: boolean;
        "rotation-per-second"?: string;
        "shadow-intensity"?: string | number;
        "shadow-softness"?: string | number;
        "environment-image"?: string;
        exposure?: string | number;
        "tone-mapping"?: string;
        "camera-orbit"?: string;
        "field-of-view"?: string;
        "min-field-of-view"?: string;
        "max-camera-orbit"?: string;
        "interaction-prompt"?: string;
        "disable-pan"?: boolean;
        loading?: string;
        reveal?: string;
      };
    }
  }
}
