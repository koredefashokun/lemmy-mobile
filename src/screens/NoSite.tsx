import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import authStyles from "../styles/auth";

const NoSite = () => {
  const { navigate } = useNavigation();

  const handleAddSite = () => navigate("SiteSetup");

  return (
    <View
      style={[
        authStyles.container,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <Text style={{ color: "#DEDEDE", fontSize: 16 }}>
        You have not added any sites.
      </Text>
      <TouchableOpacity onPress={handleAddSite}>
        <Text style={{ color: "#DEDEDE", fontSize: 16 }}>Add Site</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoSite;
