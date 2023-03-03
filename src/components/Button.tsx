import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

const baseStyles = {
  solid:
    "inline-flex justify-center rounded-lg py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors",
  outline:
    "inline-flex justify-center rounded-lg border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-sm outline-2 outline-offset-2 transition-colors",
};
const variantStyles = {
  solid: {
    cyan: "relative overflow-hidden bg-cyan-500 text-white before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-cyan-600 active:text-white/80 before:transition-colors",
    white:
      "bg-white light:text-cyan-900 hover:bg-white/90 active:bg-white/90 active:text-cyan-900/70",
    gray: "bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-800 active:text-white/80",
    red: "bg-red-600 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
  },
  outline: {
    gray: "border-gray-300 light:text-gray-700 hover:border-gray-400 active:bg-gray-100 active:text-gray-700/80",
    white: "",
    cyan: "",
    red: "",
  },
};

type ButtonProps = {
  href?: string;
  variant?: "solid" | "outline";
  color?: string;
  additionalStyling?: string;
  onClickHandler?: () => void;
  postClickHook?: () => void;
  text: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  submitType?: boolean;
  showBackArrow?: boolean;
};

export const Button = ({
  href,
  variant = "solid",
  color = "gray",
  additionalStyling = "",
  onClickHandler,
  text,
  postClickHook,
  disabled = false,
  isSubmitting,
  submitType,
  showBackArrow = false,
}: ButtonProps) => {
  if (variant !== "solid" && variant !== "outline") {
    throw new Error("Invalid Variant Prop");
  }
  if (
    color !== "cyan" &&
    color !== "white" &&
    color !== "gray" &&
    color !== "red"
  ) {
    throw new Error("Invalid Color Prop");
  }

  const baseStyle = baseStyles[variant];
  const variantStyleList = variantStyles[variant];
  let variantStyle = "";
  const router = useRouter();

  if (Object.keys(variantStyleList).includes(color)) {
    variantStyle = variantStyleList[color];
  } else {
    variantStyle = variantStyleList[color];
  }

  const styling = `${variantStyle} ${baseStyle} ${additionalStyling} disabled:cursor-not-allowed`;

  if (href && !disabled) {
    if (!postClickHook) {
      const regEx = /^http/;

      if (regEx.test(href)) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styling}
          >
            <div className="flex items-center">
              {showBackArrow ? (
                <ArrowLeftIcon className="mr-1 h-4 w-4" />
              ) : null}{" "}
              {text}
            </div>
          </a>
        );
      }

      return (
        <Link href={href} className={styling} passHref>
          <div className="flex items-center">
            {showBackArrow ? <ArrowLeftIcon className="mr-1 h-4 w-4" /> : null}{" "}
            {text}
          </div>
        </Link>
      );
    }
    return (
      <button
        disabled={disabled}
        className={styling}
        onClick={() => {
          void router.push(href);
          postClickHook();
        }}
      >
        {text}
      </button>
    );
  }

  if (submitType) {
    return (
      <div className="col-span-2 flex justify-end">
        <button disabled={isSubmitting} type="submit" className={styling}>
          {isSubmitting ? (
            <>
              <ClipLoader color="white" size={20} />
            </>
          ) : (
            <>{text}</>
          )}
        </button>
      </div>
    );
  }

  if (!onClickHandler) {
    throw new Error("Please supply an on-click handler");
  }

  return (
    <button
      disabled={disabled}
      onClick={() => {
        onClickHandler();
        if (postClickHook) {
          postClickHook();
        }
      }}
      className={styling}
    >
      {isSubmitting ? (
        <>
          <ClipLoader
            color={color == "white" || color == "gray" ? "black" : "white"}
            size={20}
          />
        </>
      ) : (
        <>{text}</>
      )}
    </button>
  );
};
