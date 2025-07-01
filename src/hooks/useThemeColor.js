import { argbFromHex } from '@material/material-color-utilities';
import { getThemeStyles, themeFromSourceColor } from '@/utils/theme-helper';

export default function useThemeColor(color, isDark) {
  if (!color || !/^#[0-9a-f]{6}$/i.test(color)) {
    return {};
  }
  const theme = themeFromSourceColor(argbFromHex(color), 'SchemeTonalSpot', 0.0, []);
  return getThemeStyles(theme, { dark: isDark });
}
