import type { VariantRef } from "./types";

export const VARIANTS: VariantRef[] = [
  {
    id: "valve",
    displayName: "Valve Proton",
    repoUrl: "https://github.com/ValveSoftware/Proton",
    readmeUrl: "https://raw.githubusercontent.com/ValveSoftware/Proton/HEAD/README.md",
    releaseUrl: "https://api.github.com/repos/ValveSoftware/Proton/releases/latest",
  },
  {
    id: "cachyos",
    displayName: "Proton CachyOS",
    repoUrl: "https://github.com/CachyOS/proton-cachyos",
    readmeUrl: "https://raw.githubusercontent.com/CachyOS/proton-cachyos/HEAD/README.md",
    releaseUrl: "https://api.github.com/repos/CachyOS/proton-cachyos/releases/latest",
  },
  {
    id: "em",
    displayName: "Proton EM",
    repoUrl: "https://github.com/Etaash-mathamsetty/Proton",
    readmeUrl: "https://raw.githubusercontent.com/Etaash-mathamsetty/Proton/HEAD/README.md",
    releaseUrl: "https://api.github.com/repos/Etaash-mathamsetty/Proton/releases/latest",
  },
  {
    id: "ge",
    displayName: "Proton GE",
    repoUrl: "https://github.com/GloriousEggroll/proton-ge-custom",
    readmeUrl: "https://raw.githubusercontent.com/GloriousEggroll/proton-ge-custom/HEAD/README.md",
    releaseUrl: "https://api.github.com/repos/GloriousEggroll/proton-ge-custom/releases/latest",
  },
  {
    id: "dwproton",
    displayName: "DWProton",
    repoUrl: "https://dawn.wine/dawn-winery/dwproton",
    readmeUrl: "https://dawn.wine/dawn-winery/dwproton/raw/branch/main/README.md",
    releaseUrl: "https://dawn.wine/dawn-winery/dwproton",
  },
  {
    id: "rtsp",
    displayName: "Proton GE-RTSP",
    repoUrl: "https://github.com/SpookySkeletons/proton-ge-rtsp",
    readmeUrl: "https://raw.githubusercontent.com/SpookySkeletons/proton-ge-rtsp/HEAD/README.md",
    releaseUrl: "https://api.github.com/repos/SpookySkeletons/proton-ge-rtsp/releases/latest",
  },
];

export function getVariant(id: string): VariantRef | undefined {
  return VARIANTS.find((v) => v.id === id);
}
