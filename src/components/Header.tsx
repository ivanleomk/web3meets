import { Button } from "./Button";
import Navlinks from "./Navlinks";
import { AUTHENTICATED_LINKS, LINKS } from "../config/links";
import MobileDropdownMenu from "./MobileDropdownMenu";

import Logo from "./Logo";

import { useUserContext } from "../context/UserContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-toastify";
import UserAvatarDropdown from "./UserAvatarDropdown";

export function Header() {
  const { isAuthenticated } = useUserContext();
  const supabaseClient = useSupabaseClient();

  return (
    <header>
      <nav className="">
        <div className="relative flex justify-between py-8 px-10">
          <div className="relative z-30 flex items-center gap-16">
            <Logo />
            <div className="hidden lg:flex lg:gap-10">
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
                  text="Submit An Event"
                  variant="solid"
                  color="gray"
                  href="/dashboard?mode=Events&view=create"
                  additionalStyling="hidden lg:block"
                />
                <Button
                  variant="outline"
                  href="/dashboard"
                  text="Dashboard"
                  additionalStyling="hidden lg:block"
                />
                <UserAvatarDropdown />
              </>
            ) : (
              <>
                <Button
                  text="Submit An Event"
                  variant="solid"
                  color="gray"
                  href="/add-event"
                  additionalStyling="hidden lg:block"
                />
                <Button
                  text="Log In"
                  variant="outline"
                  href="/login"
                  additionalStyling="hidden lg:block"
                />
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
