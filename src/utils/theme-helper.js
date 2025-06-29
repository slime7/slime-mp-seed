import * as m3utils from '@material/material-color-utilities';
/**
 * All available color tokens
 */
const tokens = [
  'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer', 'inversePrimary',
  'primaryFixed', 'primaryFixedDim', 'onPrimaryFixed', 'onPrimaryFixedVariant',
  'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
  'secondaryFixed', 'secondaryFixedDim', 'onSecondaryFixed', 'onSecondaryFixedVariant',
  'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
  'tertiaryFixed', 'tertiaryFixedDim', 'onTertiaryFixed', 'onTertiaryFixedVariant',
  'error', 'onError', 'errorContainer', 'onErrorContainer',
  'surfaceDim', 'surface', 'surfaceBright',
  'surfaceContainerLowest', 'surfaceContainerLow', 'surfaceContainer', 'surfaceContainerHigh', 'surfaceContainerHighest',
  'onSurface', 'onSurfaceVariant', 'outline', 'outlineVariant',
  'inverseSurface', 'inverseOnSurface',
  'surfaceVariant', 'surfaceTint',
  'background', 'onBackground',
  'shadow', 'scrim',
];
/**
 * Generate custom color group from source and target color
 *
 * @param source Source color
 * @param color Custom color
 * @param variant Scheme variant, equal to scheme class name (SchemeMonochrome, SchemeNeutral, SchemeTonalSpot,...)
 * @param contrastLevel Contrast level between -1.0 and 1.0
 * @return Custom color group
 *
 * @link https://m3.material.io/styles/color/the-color-system/color-roles
 */
export function customColor(source, color, variant = 'SchemeTonalSpot', contrastLevel = 0.0) {
  let { value } = color;
  const from = value;
  const to = source;
  if (color.blend) {
    value = m3utils.Blend.harmonize(from, to);
  }
  const hct = m3utils.Hct.fromInt(value);
  const scheme = new m3utils[variant](hct, false, contrastLevel);
  const darkScheme = new m3utils[variant](hct, true, contrastLevel);
  const getDynamicColor = (token, scheme) => m3utils.MaterialDynamicColors[token].getArgb(scheme);
  return {
    color,
    value,
    light: {
      color: getDynamicColor('primary', scheme),
      onColor: getDynamicColor('onPrimary', scheme),
      colorContainer: getDynamicColor('primaryContainer', scheme),
      onColorContainer: getDynamicColor('onPrimaryContainer', scheme),
    },
    dark: {
      color: getDynamicColor('primary', darkScheme),
      onColor: getDynamicColor('onPrimary', darkScheme),
      colorContainer: getDynamicColor('primaryContainer', darkScheme),
      onColorContainer: getDynamicColor('onPrimaryContainer', darkScheme),
    },
  };
}
/**
 * Generate a theme from a source color
 *
 * @param source Source color
 * @param customColors Array of custom colors
 * @param variant Scheme variant, equal to scheme class name (SchemeMonochrome, SchemeNeutral, SchemeTonalSpot,...)
 * @param contrastLevel Contrast level between -1.0 and 1.0
 * @return Theme object
 */
export function themeFromSourceColor(source, variant = 'SchemeTonalSpot', contrastLevel = 0.0, customColors = []) {
  const hct = m3utils.Hct.fromInt(source);
  const scheme = new m3utils[variant](hct, false, contrastLevel);
  const darkScheme = new m3utils[variant](hct, true, contrastLevel);
  const getDynamicColors = (scheme) => Object.fromEntries(tokens.map((token) => [token, m3utils.MaterialDynamicColors[token].getArgb(scheme)]));
  const theme = {
    source,
    schemes: {
      light: getDynamicColors(scheme),
      dark: getDynamicColors(darkScheme),
    },
    palettes: {
      primary: scheme.primaryPalette,
      secondary: scheme.secondaryPalette,
      tertiary: scheme.tertiaryPalette,
      neutral: scheme.neutralPalette,
      neutralVariant: scheme.neutralVariantPalette,
      error: scheme.errorPalette,
    },
    customColors: customColors.map((c) => customColor(source, c, variant, contrastLevel)),
  };
  // eslint-disable-next-line no-proto
  // theme.schemes.__proto__.toJSON = function () {
  //   return this;
  // };
  return theme;
}
/**
 * Generate a theme from an image source
 *
 * @param image Image element
 * @param variant Scheme variant, equal to scheme class name (SchemeMonochrome, SchemeNeutral, SchemeTonalSpot,...)
 * @param contrastLevel Contrast level between -1.0 and 1.0
 * @param customColors Array of custom colors
 * @return Theme object
 */
export async function themeFromImage(image, variant = 'SchemeTonalSpot', contrastLevel = 0.0, customColors = []) {
  const source = await m3utils.sourceColorFromImage(image);
  return themeFromSourceColor(source, variant, contrastLevel, customColors);
}

export function getThemeStyles(theme, { dark = false }) {
  const styles = {};
  const schemes = dark ? theme.schemes.dark : theme.schemes.light;
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(schemes)) {
    const token = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const color = m3utils.hexFromArgb(value);
    styles[`--md-color-${token}`] = color;
  }
  return styles;
}
