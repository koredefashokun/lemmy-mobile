import { StyleSheet } from "react-native";
import { colors } from "./theme";

const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#222222",
  },
  header: {
    fontWeight: "bold",
    fontSize: 32,
    color: colors.gray,
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#DEDEDE",
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderRadius: 4,
    height: 40,
    color: "#FFFFFF",
    backgroundColor: colors.secondary,
    paddingLeft: 15,
    fontSize: 16,
  },
  button: {
    borderRadius: 6,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.success,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 17,
  },
});

export default authStyles;
