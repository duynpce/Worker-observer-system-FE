import clsx from 'clsx';
import { inputClass } from '../constant/className.costant';
type InputWithLabelProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  blockClassName?: string;
};


const InputWithLabel = ({ label, className, blockClassName, ...props }: InputWithLabelProps) => (
  <div className={clsx("flex flex-col gap-1", blockClassName)}>
    <label>
      {label}
    </label>
    <input className={clsx(className, inputClass)} {...props} />
  </div>
);

export default InputWithLabel;