import { Switch } from "react-native";
import { useColorScheme } from "nativewind";

export const ThemeSwitcher = () => {
  const { toggleColorScheme, colorScheme } = useColorScheme();

  // useEffect(() => {
  //   if (colorScheme === "dark") {
  //     NavigationBar.setBackgroundColorAsync("#000000");
  //     NavigationBar.setButtonStyleAsync("light");
  //   } else {
  //     NavigationBar.setBackgroundColorAsync("#ffffff");
  //     NavigationBar.setButtonStyleAsync("dark");
  //   }
  // }, [colorScheme]);

  return (
    <Switch
      value={colorScheme === "dark"}
      onValueChange={toggleColorScheme}
      trackColor={{ false: "#1f1f1f", true: "#f97316" }}
      thumbColor="#ffffff"
    />
  );
};
