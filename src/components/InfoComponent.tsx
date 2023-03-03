import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

type Props = {
  localStorageKey: string;
  message: string;
  href?: string;
};

export default function InfoComponent({
  localStorageKey,
  message,
  href,
}: Props) {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(localStorageKey)) {
      setDisplay(true);
    }
  }, [localStorageKey]);

  const handleClick = () => {
    alert("Clicked!");
    setDisplay(false);
    localStorage.setItem(localStorageKey, "True");
  };

  if (!display) {
    return null;
  }
  return (
    <div className="my-4 max-w-3xl rounded-md bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <div>
            <p className="text-sm text-blue-700">{message}</p>

            {href ? (
              <p className="mt-3 text-sm md:mt-0 ">
                <a
                  href={href}
                  className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                >
                  Details
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </p>
            ) : null}
          </div>

          <XMarkIcon
            className="h-5 w-5 cursor-pointer text-blue-400"
            onClick={() => handleClick()}
          />
        </div>
      </div>
    </div>
  );
}
