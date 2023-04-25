import React, { useState } from "react";
import {
  ADMIN_ORGANIZATION_FIELDS,
  SUBMITTED_EVENT_FIELDS,
} from "../config/organization";
import { api } from "../utils/api";
import AdminOrganizationTableRow from "./AdminOrganizationTableRow";
import EventApprovalRow from "./EventApprovalRow";
import OrganizationTable from "./OrganizationTable";
import SectionHeader from "./SectionHeader";

const AdminDashboard = () => {
  const {
    data: latestEvents,
    isLoading: EventsLoading,
    error: EventError,
  } = api.admin.getEvents.useQuery(undefined, {
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });
  const {
    data: latestOrganization,
    isLoading: OrganizationLoading,
    error: OrganizationError,
  } = api.admin.getOrganisation.useQuery(
    undefined,

    {
      refetchInterval: 30000,
      refetchOnWindowFocus: false,
    }
  );

  const [showPendingApprovals, setPendingApprovals] = useState(false);
  const [showPendingOrganizations, setPendingOrganizations] = useState(false);

  if (EventError || OrganizationError) {
    return (
      <>
        <SectionHeader
          title="We got an error"
          subtitle="Check with dev team~..."
        >
          <p>Events : {EventError?.message}</p>
          <p>Organizations : {OrganizationError?.message}</p>
        </SectionHeader>
      </>
    );
  }

  return (
    <>
      <SectionHeader
        title="Event Dashboard"
        subtitle="You can approve submitted events and organisations with the event dashboard "
        buttonText={
          showPendingApprovals
            ? "Show All Events"
            : "Show Unapproved Events Only"
        }
        onClickHandler={() => {
          setPendingApprovals(!showPendingApprovals);
        }}
      >
        <OrganizationTable
          data={
            latestEvents
              ? latestEvents.filter((item) => {
                  if (!showPendingApprovals) {
                    return true;
                  }
                  return !item.approved;
                })
              : []
          }
          isLoading={EventsLoading}
          errorMessage="No Events Found"
          headerFields={SUBMITTED_EVENT_FIELDS}
          renderComponent={(data) => {
            return <EventApprovalRow key={data.event_id} data={data} />;
          }}
        />
      </SectionHeader>
      <div className="my-40" />
      <SectionHeader
        title="Organization Dashboard"
        subtitle="You can approve new requests to create organizations and more! "
        buttonText={
          showPendingOrganizations
            ? "Show All Organizations"
            : "Show Unapproved Organizations Only"
        }
        onClickHandler={() => {
          setPendingOrganizations(!showPendingOrganizations);
        }}
      >
        <OrganizationTable
          data={
            latestOrganization
              ? latestOrganization.filter((item) => {
                  if (!showPendingOrganizations) {
                    return true;
                  }
                  return !item.approved;
                })
              : []
          }
          isLoading={OrganizationLoading}
          errorMessage="No Events Found"
          headerFields={ADMIN_ORGANIZATION_FIELDS}
          renderComponent={(data) => {
            return <AdminOrganizationTableRow data={data} />;
          }}
        />
      </SectionHeader>
      <div className="my-40" />
    </>
  );
};

export default AdminDashboard;
