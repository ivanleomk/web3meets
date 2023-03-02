import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import { getTrackBackground, Range } from "react-range";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  step: number;
  min: number;
  max: number;
  fmtFunction: (v1: number, v2: number) => string;
};

const InputRangeSlider = <T extends FieldValues>({
  label,
  control,
  name,
  step,
  min,
  max,
  fmtFunction,
}: Props<T>) => {
  const [displayValue, setDisplayValue] = useState([0, 24]);
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
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value: values } }) => {
            return (
              <Range
                values={values}
                step={step}
                min={min}
                max={max}
                rtl={false}
                onChange={(values) => {
                  onChange(values);
                  setDisplayValue(values);
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
                          colors: ["#000", "#A5F3FC", "#000"],
                          min,
                          max,
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
            );
          }}
        />
      </div>
      <output className="mt-2 flex w-full items-start justify-start  text-left text-[12px] text-gray-500">
        {fmtFunction(displayValue[0] as number, displayValue[1] as number)}
      </output>
    </div>
  );
};

export default InputRangeSlider;
