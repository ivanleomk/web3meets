import type { FormikErrors, FormikTouched} from "formik";
import { useFormikContext } from "formik";
import React from "react";
import { getTrackBackground, Range } from "react-range";

const STEP = 1;
const MIN = 0;
const MAX = 24;

type RangeInputProps<T> = {
  label: string;
  step: number;
  min: number;
  max: number;
  value1: number;
  value2: number;
  value1FormKey: keyof T;
  value2FormKey: keyof T;
  touched: FormikTouched<T>;
  errors: FormikErrors<T>;
  fmtFunction: (s1: number, s2: number) => string;
};

const RangeInput = <T,>({
  label,
  value1FormKey,
  value2FormKey,
  value1,
  value2,
  fmtFunction,
}: RangeInputProps<T>) => {
  const values = [value1, value2];
  const { setFieldValue } = useFormikContext();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">{label}</h2>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Range
          values={[value1, value2]}
          step={STEP}
          min={MIN}
          max={MAX}
          rtl={false}
          onChange={(values) => {
            setFieldValue(value1FormKey as string, values[0]);
            setFieldValue(value2FormKey as string, values[1]);
          }}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: "36px",
                display: "flex",
                width: "100%",
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: "5px",
                  width: "100%",
                  borderRadius: "4px",
                  background: getTrackBackground({
                    values,
                    colors: ["#ccc", "#548BF4", "#ccc"],
                    min: MIN,
                    max: MAX,
                    rtl: false,
                  }),
                  alignSelf: "center",
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props }) => {
            return (
              <div {...props}>
                <div className="outline-none-0 z-[0_!important] h-3  w-3 cursor-pointer rounded-full bg-gray-400  text-xs outline-none  ring-0 focus:ring-0 " />
              </div>
            );
          }}
        />
        <output className="mt-2 flex w-full items-start justify-start  text-left text-[12px] text-gray-500">
          {fmtFunction(value1, value2)}
        </output>
      </div>
    </div>
  );
};

export default RangeInput;
