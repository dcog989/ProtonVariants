import type { VariantRef } from "./types";

export const VARIANTS: VariantRef[] = [
  {
    id: "valve",
    displayName: "Proton (Valve)",
    repoUrl: "https://github.com/ValveSoftware/Proton",
    readmeUrl: "https://raw.githubusercontent.com/ValveSoftware/Proton/HEAD/README.md",
    feedUrl: "https://github.com/ValveSoftware/Proton/releases.atom",
  },
  {
    id: "cachyos",
    displayName: "Proton CachyOS",
    repoUrl: "https://github.com/CachyOS/proton-cachyos",
    readmeUrl: "https://raw.githubusercontent.com/CachyOS/proton-cachyos/HEAD/README.md",
    feedUrl: "https://github.com/CachyOS/proton-cachyos/releases.atom",
  },
  {
    id: "em",
    displayName: "Proton EM",
    repoUrl: "https://github.com/Etaash-mathamsetty/Proton",
    readmeUrl: "https://raw.githubusercontent.com/Etaash-mathamsetty/Proton/HEAD/README.md",
    feedUrl: "https://github.com/Etaash-mathamsetty/Proton/releases.atom",
  },
  {
    id: "ge",
    displayName: "Proton GE Custom",
    repoUrl: "https://github.com/GloriousEggroll/proton-ge-custom",
    readmeUrl: "https://raw.githubusercontent.com/GloriousEggroll/proton-ge-custom/HEAD/README.md",
    feedUrl: "https://github.com/GloriousEggroll/proton-ge-custom/releases.atom",
  },
  {
    id: "dwproton",
    displayName: "DWProton",
    repoUrl: "https://dawn.wine/dawn-winery/dwproton",
    readmeUrl: "https://dawn.wine/dawn-winery/dwproton/raw/branch/main/README.md",
    feedUrl: "https://dawn.wine/dawn-winery/dwproton/releases.atom",
  },
  {
    id: "rtsp",
    displayName: "Proton GE RTSP",
    repoUrl: "https://github.com/SpookySkeletons/proton-ge-rtsp",
    readmeUrl: "https://raw.githubusercontent.com/SpookySkeletons/proton-ge-rtsp/HEAD/README.md",
    feedUrl: "https://github.com/SpookySkeletons/proton-ge-rtsp/releases.atom",
  },
];

export function getVariant(id: string): VariantRef | undefined {
  return VARIANTS.find((v) => v.id === id);
}
