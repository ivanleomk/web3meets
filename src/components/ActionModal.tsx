import React, { type ReactElement } from "react";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "./Button";

type Props = {
  buttonText: string;
  variant: "solid" | "outline";
  modalTitle: string;
  modalSubtitle: string;
  children: ReactElement;
  metadata: Record<string, string>;
  disabled: boolean;
};

const ActionModal = ({
  variant,
  buttonText,
  modalTitle,
  modalSubtitle,
  children,
  metadata,
  disabled = false,
}: Props) => {
  const [open, setOpen] = useState(false);

  const cancelButtonRef = useRef(null);
  return (
    <>
      <Button
        text={buttonText}
        onClickHandler={() => {
          setOpen(true);
        }}
        variant={variant}
        disabled={disabled}
      />
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h1"
                        className="my-6 text-xl font-medium leading-6 text-gray-900"
                      >
                        {modalTitle}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="mb-6 text-left text-sm text-gray-500">
                          {modalSubtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                  {React.Children.map(children, (child, i) => {
                    return React.cloneElement(child, {
                      //this properties are available as a props in child components
                      postClickHook: setOpen,
                      closingRef: cancelButtonRef,
                      metadata: metadata,
                    });
                  })}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default ActionModal;
