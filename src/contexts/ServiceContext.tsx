import React from "react";
import { WebSocketService } from "../services";

export const ServiceContext = React.createContext<{
  service: WebSocketService | undefined;
}>({ service: undefined });
