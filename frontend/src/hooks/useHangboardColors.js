import { useTheme, useColorMode } from '@chakra-ui/core';

export default () => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const colors = {
    dark: {
      line: theme.colors.blue['200'],
      defaultFill: theme.colors.purple['300'],
      activeFill: theme.colors.orange['200'],
    },
    light: {
      line: theme.colors.gray['700'],
      defaultFill: theme.colors.purple['200'],
      activeFill: theme.colors.red['200'],
    },
  };
  return colors[colorMode];
};
