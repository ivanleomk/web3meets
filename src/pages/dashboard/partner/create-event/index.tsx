import { useRouter } from "next/router";
import React from "react";
import { Button } from "../../../../components/Button";
import CreateEventForm from "../../../../components/CreateEventForm";
import SectionHeader from "../../../../components/SectionHeader";

const CreateEventPage = () => {
  const router = useRouter();
  const { partner_id } = router.query;

  if (!partner_id) {
    return null;
  }

  return (
    <>
      <div className="-mb-14">
        <Button
          variant="outline"
          text="Return to organization page"
          href={`/dashboard/partner?partner_id=${partner_id}`}
        />
      </div>
      <SectionHeader
        title="Create a new event"
        subtitle="We just need a bit more information from you before we can list your event "
      >
        <CreateEventForm
          initialValue={undefined}
          buttonText="Create Event"
          onSubmit={(data) => console.log(data)}
        />
      </SectionHeader>
    </>
  );
};

export default CreateEventPage;
