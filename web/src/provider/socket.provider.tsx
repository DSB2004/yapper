"use client";

import {
  getAccessToken,
  getRefreshToken,
} from "@/app/actions/auth/cookie.action";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let socketInstance: any = null;
    (async () => {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();
      if (!accessToken || !refreshToken) return;
      socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        transports: ["websocket"],
        withCredentials: true,
        auth: {
          "access-token": accessToken,
          "refresh-token": refreshToken,
        },
      });

      setSocket(socketInstance);

      socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance.id);
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });
    })();

    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
