import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

type Props<T extends FieldValues> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T>;
  name: Path<T>;
  label: string;
  subtitle: string;
  options: {
    id: string;
    title: string;
  }[];
};

const InputRadioGroup = <T extends FieldValues>({
  control,
  name,
  label,
  subtitle,
  options,
}: Props<T>) => {
  return (
    <div>
      <label className="text-base font-semibold leading-6 text-gray-900">
        {label}
      </label>
      <p className="text-sm leading-5 text-gray-500">{subtitle}</p>
      <fieldset className="mt-4">
        <div className="space-y-4">
          <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <>
                {options.map((item) => {
                  return (
                    <div className="flex items-center" key={item.id}>
                      <input
                        name={name}
                        onChange={onChange}
                        onBlur={onBlur}
                        ref={ref}
                        type="radio"
                        value={item.id}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        {item.title}
                      </label>
                    </div>
                  );
                })}
              </>
            )}
          />
        </div>
      </fieldset>
    </div>
  );
};

export default InputRadioGroup;
