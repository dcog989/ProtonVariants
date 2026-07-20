import type { VariantRef } from "./types";

export const VARIANTS: VariantRef[] = [
  {
    id: "valve",
    displayName: "Valve Proton",
    repoUrl: "https://github.com/ValveSoftware/Proton",
    readmeUrl: "https://raw.githubusercontent.com/ValveSoftware/Proton/HEAD/README.md"
  },
  {
    id: "cachyos",
    displayName: "Proton CachyOS",
    repoUrl: "https://github.com/CachyOS/proton-cachyos",
    readmeUrl: "https://raw.githubusercontent.com/CachyOS/proton-cachyos/HEAD/README.md"
  },
  {
    id: "etaash",
    displayName: "Etaash Proton",
    repoUrl: "https://github.com/Etaash-mathamsetty/Proton",
    readmeUrl: "https://raw.githubusercontent.com/Etaash-mathamsetty/Proton/HEAD/README.md"
  },
  {
    id: "ge",
    displayName: "Proton GE",
    repoUrl: "https://github.com/GloriousEggroll/proton-ge-custom",
    readmeUrl: "https://raw.githubusercontent.com/GloriousEggroll/proton-ge-custom/HEAD/README.md"
  },
  {
    id: "dwproton",
    displayName: "DWProton",
    repoUrl: "https://dawn.wine/dawn-winery/dwproton",
    readmeUrl: "https://dawn.wine/dawn-winery/dwproton/raw/branch/main/README.md"
  }
];

export function getVariant(id: string): VariantRef | undefined {
  return VARIANTS.find((v) => v.id === id);
}
