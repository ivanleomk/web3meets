import { Button } from "./Button";
import Navlinks from "./Navlinks";
import { LINKS } from "../config/links";
import MobileDropdownMenu from "./MobileDropdownMenu";

import Logo from "./Logo";

import UserAvatarDropdown from "./UserAvatarDropdown";
import { useUserContext } from "../context/UserContext";

export function Header() {
  const { isAuthenticated } = useUserContext();

  return (
    <header>
      <nav className="mx-auto max-w-7xl">
        <div className="relative z-50 flex justify-between py-8 px-10">
          <div className="relative z-10 flex items-center gap-16">
            <Logo />
            <div className="hidden md:flex md:gap-10">
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
