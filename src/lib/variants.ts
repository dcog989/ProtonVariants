import type { VariantRef } from "./types";

export const VARIANTS: VariantRef[] = [
  {
    id: "valve",
    displayName: "Proton (Valve)",
    description: "Valve’s official Proton, the Steam compatibility layer that lets Windows games run on Linux.",
    repoUrl: "https://github.com/ValveSoftware/Proton",
    readmeUrl: "https://raw.githubusercontent.com/ValveSoftware/Proton/HEAD/README.md",
    feedUrl: "https://github.com/ValveSoftware/Proton/releases.atom",
    tagsUrl: "https://api.github.com/repos/ValveSoftware/Proton/tags?per_page=100",
  },
  {
    id: "cachyos",
    displayName: "Proton CachyOS",
    description:
      "Proton built for and by CachyOS, adding experimental features, third-party tools, and umu-launcher support.",
    repoUrl: "https://github.com/CachyOS/proton-cachyos",
    readmeUrl: "https://raw.githubusercontent.com/CachyOS/proton-cachyos/HEAD/README.md",
    feedUrl: "https://github.com/CachyOS/proton-cachyos/releases.atom",
  },
  {
    id: "em",
    displayName: "Proton EM",
    description: "A fork of Proton adding video codec fixes, FSR 4.1.1 with MLFG, and Protonfixes/UMU support.",
    repoUrl: "https://github.com/Etaash-mathamsetty/Proton",
    readmeUrl: "https://raw.githubusercontent.com/Etaash-mathamsetty/Proton/HEAD/README.md",
    feedUrl: "https://github.com/Etaash-mathamsetty/Proton/releases.atom",
  },
  {
    id: "ge",
    displayName: "Proton GE Custom",
    description:
      "GloriousEggroll’s community build of Proton with custom patches, extra media codecs, and game fixes not yet in official releases.",
    repoUrl: "https://github.com/GloriousEggroll/proton-ge-custom",
    readmeUrl: "https://raw.githubusercontent.com/GloriousEggroll/proton-ge-custom/HEAD/README.md",
    feedUrl: "https://github.com/GloriousEggroll/proton-ge-custom/releases.atom",
  },
  {
    id: "dwproton",
    displayName: "DWProton",
    description:
      "Dawn Winery’s fork based on Proton-CachyOS, focused on fixes for anime and gacha games, plus Proton-EM compatibility fixes.",
    repoUrl: "https://dawn.wine/dawn-winery/dwproton",
    readmeUrl: "https://dawn.wine/dawn-winery/dwproton/raw/branch/main/README.md",
    feedUrl: "https://dawn.wine/dawn-winery/dwproton/releases.atom",
  },
  {
    id: "rtsp",
    displayName: "Proton GE RTSP",
    description: "A personal fork of Proton GE Custom with additional patches on top of GE-Proton.",
    repoUrl: "https://github.com/SpookySkeletons/proton-ge-rtsp",
    readmeUrl: "https://raw.githubusercontent.com/SpookySkeletons/proton-ge-rtsp/HEAD/README.md",
    feedUrl: "https://github.com/SpookySkeletons/proton-ge-rtsp/releases.atom",
  },
];

export function getVariant(id: string): VariantRef | undefined {
  return VARIANTS.find((v) => v.id === id);
}
