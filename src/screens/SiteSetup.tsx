import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SitesContext } from "../contexts/SitesContext";
import authStyles from "../styles/auth";
import { colors } from "../styles/theme";

// TODO: Move all the copy for this component into the translation files.
const SiteSetup: React.FC = () => {
  const [siteUrl, setSiteUrl] = React.useState("");
  const { addSite } = React.useContext(SitesContext);
  const { goBack } = useNavigation();

  const handleSubmit = () => {
    // This might have to become async, (see comment below).
    addSite({
      wsUri: siteUrl,
      name: "Site name", // TODO: Make this get the actual name of the site (preferrably without a request to the site's server).
    });
    goBack();
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <Text style={authStyles.header}>Add new site</Text>
      <View style={authStyles.inputContainer}>
        <Text style={authStyles.label}>Site URL</Text>
        <TextInput
          style={authStyles.input}
          placeholder="https://dev.lemmy.ml/api/ws/v1"
          placeholderTextColor={colors.gray}
          onChangeText={setSiteUrl}
        />
      </View>
      <TouchableOpacity onPress={handleSubmit} style={authStyles.button}>
        <Text style={authStyles.buttonText}>Add Site</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SiteSetup;
