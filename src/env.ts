import Constants from "expo-constants";

export const wsUri = `ws://${Constants.manifest.debuggerHost
  ?.split(":")
  ?.shift()
  ?.concat(":8536")}/api/v1/ws`;
