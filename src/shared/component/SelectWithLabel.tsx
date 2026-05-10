import clsx from 'clsx';
import { inputClass } from '../constant/className.costant';
type SelectWithLabelProps<T> = React.SelectHTMLAttributes<HTMLSelectElement> & {
  data: T[];
  label: string;
  blockClassName?: string;
  getOptionLabel?: (item: T) => string;
  getOptionValue?: (item: T) => string | number;
};


const SelectWithLabel = <T,>({
  label,
  className,
  blockClassName,
  data,
  getOptionLabel,
  getOptionValue,
  ...props
}: SelectWithLabelProps<T>) => (
  <div className={clsx("flex flex-col gap-1", blockClassName)}>
    <label>
      {label}
    </label>
    <select className={clsx(className, inputClass)} {...props} >
      {data.map((item, index) => {
        const value = getOptionValue ? getOptionValue(item) : String(item);
        const labelText = getOptionLabel ? getOptionLabel(item) : String(item);

        return (
        <option key={`${String(value)}-${index}`} value={value}>
          {labelText}
        </option>
      )})}
    </select>
  </div>
);

export default SelectWithLabel;