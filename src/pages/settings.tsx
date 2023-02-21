import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import SectionHeader from "../components/SectionHeader";

const Settings = () => {
  const supabaseClient = useSupabaseClient();
  const [password, setPassword] = useState("");
  return (
    <div>
      <SectionHeader
        title="Account Details"
        subtitle="Update your account details here"
      >
        <div className="mt-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4  sm:border-gray-200 sm:pt-5">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            Password
          </label>
          <div className="mt-1 sm:col-span-2 sm:mt-0">
            <div className="flex max-w-lg rounded-md shadow-sm">
              <input
                type="text"
                name="username"
                id="username"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="username"
                placeholder="Your New Password"
                className="block w-full min-w-0 flex-1 rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <Button
                additionalStyling="ml-10"
                text="Reset Password"
                onClickHandler={() => {
                  void supabaseClient.auth
                    .updateUser({
                      password,
                    })
                    .then(() => {
                      toast.success("Succesfully updated user password");
                    })
                    .catch((err) => {
                      toast.warning(err);
                    });
                }}
              />
            </div>
          </div>
        </div>
      </SectionHeader>
    </div>
  );
};

export default Settings;
