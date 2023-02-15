import Link from "next/link";

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
  },
  outline: {
    gray: "border-gray-300 light:text-gray-700 hover:border-gray-400 active:bg-gray-100 active:text-gray-700/80",
    white: "",
    cyan: "",
  },
};

type ButtonProps = {
  href?: string;
  variant?: "solid" | "outline";
  color?: string;
  additionalStyling?: string;
  onClickHandler?: () => void;
  text: string;
};

export const Button = ({
  href,
  variant = "solid",
  color = "gray",
  additionalStyling = "",
  onClickHandler,
  text,
}: ButtonProps) => {
  if (variant !== "solid" && variant !== "outline") {
    throw new Error("Invalid Variant Prop");
  }
  if (color !== "cyan" && color !== "white" && color !== "gray") {
    throw new Error("Invalid Color Prop");
  }

  const baseStyle = baseStyles[variant];
  const variantStyleList = variantStyles[variant];
  let variantStyle = "";

  if (Object.keys(variantStyleList).includes(color)) {
    variantStyle = variantStyleList[color];
  } else {
    variantStyle = variantStyleList[color];
  }

  const styling = `${variantStyle} ${baseStyle} ${additionalStyling}`;

  if (href) {
    return (
      <Link href={href} className={styling}>
        {text}
      </Link>
    );
  }

  if (!onClickHandler) {
    throw new Error("Please supply an on-click handler");
  }

  return (
    <button onClick={() => onClickHandler()} className={styling}>
      {text}
    </button>
  );
};
