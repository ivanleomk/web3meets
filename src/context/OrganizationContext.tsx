// src/context/state.js

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { createContext, type ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { type UserPartnerOwnershipWithPartner } from "../types/database";
import { api } from "../utils/api";

type OrganizationContextType = {
  partners: UserPartnerOwnershipWithPartner[];
  isPartnersLoading: boolean;
};

type OrganizationContextProps = {
  children: ReactNode;
};

const initialOrganizationContext: OrganizationContextType = {
  partners: [],
  isPartnersLoading: true,
};

const OrganizationContext = createContext<OrganizationContextType>(
  initialOrganizationContext
);
export function OrganizationWrapper({ children }: OrganizationContextProps) {
  const user = useUser();
  const { data, isLoading } = api.partner.getAllPartners.useQuery(undefined, {
    refetchInterval: 120000,
    refetchOnWindowFocus: false,
    enabled: user !== null,
  });

  const sharedState = {
    partners: data as UserPartnerOwnershipWithPartner[],
    isPartnersLoading: isLoading,
  };

  return (
    <OrganizationContext.Provider value={sharedState}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizationContext() {
  return useContext(OrganizationContext);
}
