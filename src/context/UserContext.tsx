// src/context/state.js

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { api } from "../utils/api";

type UserContextMetadata = {
  email: string;
  isAdmin: boolean;
  profile_image: string | null;
};

type UserContextType = {
  isAuthenticated: boolean;
  userMetadata: UserContextMetadata | undefined;
};

const initialUserContext: UserContextType = {
  isAuthenticated: false,
  userMetadata: undefined,
};

type UserContextProps = {
  children: ReactNode;
};

const UserContext = createContext<UserContextType>(initialUserContext);
export function UserWrapper({ children }: UserContextProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userMetadata, setUserMetadata] = useState<
    UserContextMetadata | undefined
  >(undefined);
  const user = useUser();
  const router = useRouter();
  const supabaseClient = useSupabaseClient();

  supabaseClient.auth.onAuthStateChange((evt) => {
    //
    if (evt == "SIGNED_OUT") {
      setUserMetadata(undefined);
      setIsAuthenticated(false);
      void router.push("/");
    }
  });

  api.user.user.useQuery(undefined, {
    onSuccess: (data) => {
      const { admin, email } = data;
      setIsAuthenticated(true);
      setUserMetadata({
        email: email as string,
        isAdmin: admin,
        profile_image: null,
      });
    },
    enabled: user !== null,
    refetchInterval: 300000,
    refetchOnWindowFocus: false,
  });

  const sharedState = {
    isAuthenticated,
    userMetadata,
  };

  return (
    <UserContext.Provider value={sharedState}>{children}</UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
