import React from "react";
import SectionHeader from "./SectionHeader";
import { api } from "src/utils/api";

import { toast } from "react-toastify";
import ScheduledPostRow, { type MessageAndEvent } from "./ScheduledPostRow";

const ScheduledDashboard = () => {
  const { data, isLoading } = api.post.getAllPosts.useQuery(undefined, {
    refetchInterval: 120000,
    refetchOnWindowFocus: false,
  });

  const [showPendingApprovals, setPendingApprovals] = React.useState(false);

  return (
    <SectionHeader
      title="Scheduled Messages"
      subtitle="See what has been scheduled down the line"
      buttonText="Show scheduled messages"
      onClickHandler={() => {
        setPendingApprovals(!showPendingApprovals);
      }}
    >
      <section className="my-12">
        <h2 className="text-base font-semibold leading-6 text-gray-900">
          Upcoming Posts
        </h2>
        <ol className="mt-2 divide-y divide-gray-200 text-sm leading-6 text-gray-500">
          {data
            ?.filter((item) => {
              if (showPendingApprovals) {
                return !item.sent;
              }

              return true;
            })
            .map((item) => {
              return (
                <ScheduledPostRow
                  key={item.id}
                  item={item as MessageAndEvent}
                />
              );
            })}
        </ol>
      </section>
    </SectionHeader>
  );
};

export default ScheduledDashboard;
