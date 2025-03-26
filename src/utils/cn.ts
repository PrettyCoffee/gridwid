import {
  mergeConfigs,
  extendTailwindMerge,
  validators,
  Config,
  twJoin,
  ClassNameValue,
} from "tailwind-merge"

const getAny = () => [validators.isAny] as const

const withBgl = <ClassGroupIds extends string, ThemeGroupIds extends string>(
  prevConfig: Config<ClassGroupIds, ThemeGroupIds>
) =>
  mergeConfigs(prevConfig, {
    extend: {
      classGroups: {
        "bgl-base": [{ "bgl-base": getAny() }],
        "bgl-layer": [{ "bgl-layer": getAny() }],
      },
      conflictingClassGroups: {
        "bg-color": ["bgl-base", "bgl-layer", "bgl"],
      },
    },
  })

const twMerge = extendTailwindMerge(withBgl)

export function cn(...inputs: ClassNameValue[]) {
  return twMerge(twJoin(inputs))
}
