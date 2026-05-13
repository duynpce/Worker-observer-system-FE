import clsx from "clsx";
import { inputClass } from "../constant/className.costant";

type LabelValueProps = {
  label: string;
  value: string | number;
  className?: string;
  labelClassName? :string;
  valueClassName?:string;
};

const LabelValue = ({ label, value, className, labelClassName, valueClassName }: LabelValueProps) => {
  return (
    <div className={clsx(`flex flex-col gap-1"  ${className}`.trim())}>
      <label className={clsx(`${labelClassName}`.trim())}>
        {label}
      </label>
      <p className={clsx(`${inputClass} ${valueClassName}`.trim())}>
        {value}
      </p>
    </div>
  );
};

export default LabelValue;
