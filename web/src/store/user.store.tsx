"use client";

import React, { createContext, useContext, useMemo, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";

import { useSearchParams } from "next/navigation";
import { getUser } from "@/app/actions/user/get.action";
import { toast } from "sonner";
import { UserType } from "@/types/user";

interface UserStoreInterface {
  isFetching: boolean;
  isError: boolean;
  isLoading: boolean;
  data: UserType | undefined;
  refetch: Function;
  error: Error | null;
}

const UserStoreContext = createContext<UserStoreInterface | null>(null);

function UserStoreContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  const { isFetching, isError, isLoading, data, error, refetch } = useQuery<
    UserType | undefined
  >({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await getUser();
      if (!res.success) {
        toast.error(res.message);
      }

      return res.user;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <UserStoreContext.Provider
      value={{
        isLoading,
        isError,
        isFetching,
        data,
        error,
        refetch,
      }}
    >
      {children}
    </UserStoreContext.Provider>
  );
}

export const UserStore = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<></>}>
      <UserStoreContent>{children}</UserStoreContent>
    </Suspense>
  );
};

export const useUserStore = () => {
  const ctx = useContext(UserStoreContext);
  if (!ctx) throw new Error("useUserStore must be used inside UserStore");
  return ctx;
};
