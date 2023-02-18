import ReactDatePicker from "react-datepicker";

type FilterDatePickerProps = {
  label: string;
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

const FilterDatePicker = ({
  selectedDate,
  setSelectedDate,
  label,
}: FilterDatePickerProps) => {
  return (
    <>
      <label>{label}</label>
      <ReactDatePicker
        className="mt-2 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date as Date)}
        minDate={new Date()}
        showDisabledMonthNavigation
        placeholderText="DD/MM/YYYY"
      />
    </>
  );
};

export default FilterDatePicker;
