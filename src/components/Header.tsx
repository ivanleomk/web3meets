import { Button } from "./Button";
import Navlinks from "./Navlinks";
import { LINKS } from "../config/links";
import MobileDropdownMenu from "./MobileDropdownMenu";

import Logo from "./Logo";
import { useUser } from "@supabase/auth-helpers-react";
import UserAvatar from "./UserAvatarDropdown";
import UserAvatarDropdown from "./UserAvatarDropdown";
import { useUserContext } from "../context/UserContext";

export function Header() {
  const { isAuthenticated } = useUserContext();
  const user = useUser();
  console.log(user);
  return (
    <header>
      <nav className="mx-auto max-w-7xl">
        <div className="relative z-50 flex justify-between py-8 px-10">
          <div className="relative z-10 flex items-center gap-16">
            <Logo />
            <div className="hidden lg:flex lg:gap-10">
              <Navlinks LinkItemMetadata={LINKS} />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <MobileDropdownMenu />
            {isAuthenticated ? (
              <>
                <UserAvatarDropdown />
              </>
            ) : (
              <>
                <Button
                  text="Log In"
                  variant="outline"
                  href="/login"
                  additionalStyling="hidden lg:block"
                />
                <Button
                  text="Sign Up"
                  variant="solid"
                  color="gray"
                  href="/signup"
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
