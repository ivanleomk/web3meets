import { useRouter } from "next/router";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect } from "react";

const useAuthCheck = (redirectedFrom?: string) => {
  const { replace } = useRouter();
  const { session } = useSessionContext();

  const replaceUrl = (redirectedFrom: string) => {
    void replace(redirectedFrom);
  };

  useEffect(() => {
    if (session && redirectedFrom) {
      replaceUrl(redirectedFrom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, redirectedFrom]);
};

export default useAuthCheck;
