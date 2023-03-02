import { Button } from "./Button";
import Navlinks from "./Navlinks";
import { AUTHENTICATED_LINKS, LINKS } from "../config/links";
import MobileDropdownMenu from "./MobileDropdownMenu";

import Logo from "./Logo";

import { useUserContext } from "../context/UserContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-toastify";

export function Header() {
  const { isAuthenticated } = useUserContext();
  const supabaseClient = useSupabaseClient();

  return (
    <header>
      <nav className="mx-auto max-w-7xl">
        <div className="relative flex justify-between py-8 px-10">
          <div className="relative z-30 flex items-center gap-16">
            <Logo />
            <div className="hidden md:flex md:gap-10">
              <Navlinks
                LinkItemMetadata={isAuthenticated ? AUTHENTICATED_LINKS : LINKS}
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <MobileDropdownMenu />
            {isAuthenticated ? (
              <>
                <Button
                  text="Dashboard"
                  variant="solid"
                  color="gray"
                  href="/dashboard"
                  additionalStyling="hidden md:block"
                />
                <Button
                  variant="outline"
                  onClickHandler={() => {
                    supabaseClient.auth
                      .signOut()
                      .then(() => {
                        toast.success("Succesfully signed out of account");
                      })
                      .catch(() => {
                        toast.warning(
                          "Unable to sign user out. Unexpected error encountered."
                        );
                      });
                  }}
                  text="Sign Out"
                  additionalStyling="hidden md:block"
                />
              </>
            ) : (
              <>
                <Button
                  text="Log In"
                  variant="outline"
                  href="/login"
                  additionalStyling="hidden md:block"
                />
                <Button
                  text="Sign Up"
                  variant="solid"
                  color="gray"
                  href="/signup"
                  additionalStyling="hidden md:block"
                />
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
