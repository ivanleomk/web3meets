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
import { toast } from "react-toastify";
import {
  Partner,
  type UserPartnerOwnershipWithPartner,
} from "../types/database";
import { api } from "../utils/api";
import { useUserContext } from "./UserContext";

type OrganizationContextType = {
  partnerOptions: undefined | Partner[];
  partners: UserPartnerOwnershipWithPartner[];
  isPartnersLoading: boolean;
};

type OrganizationContextProps = {
  children: ReactNode;
};

const initialOrganizationContext: OrganizationContextType = {
  partnerOptions: [],
  partners: [],
  isPartnersLoading: true,
};

const OrganizationContext = createContext<OrganizationContextType>(
  initialOrganizationContext
);
export function OrganizationWrapper({ children }: OrganizationContextProps) {
  const user = useUser();
  const { userMetadata, isAuthenticated } = useUserContext();
  const { data, isLoading } = api.partner.getAllPartners.useQuery(undefined, {
    // Refetch every 2 mins
    refetchInterval: 120000,
    refetchOnWindowFocus: false,
    enabled: user !== null,
  });

  const { data: allOrganizations } = api.admin.getOrganisation.useQuery(
    undefined,
    {
      enabled: isAuthenticated && userMetadata?.isAdmin,
      refetchInterval: 120000,
    }
  );

  const sharedState = {
    partnerOptions: allOrganizations ? allOrganizations : [],
    partners: data ? (data as UserPartnerOwnershipWithPartner[]) : [],
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
