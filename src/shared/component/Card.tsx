import clsx from "clsx";
import LoadingSpinner from "./LoadingSpinner";

type CardProps = {
  isLoading?: boolean;
  isFetching?: boolean;
  title?: string;
  children?: React.ReactNode;
  innerClassName?: string;
 } & React.HTMLAttributes<HTMLDivElement>;

const Card = ({ title, className, innerClassName, children, isLoading, isFetching, ...props }: CardProps) => {
  return (
    <div className={clsx("flex flex-col gap-2", className)} {...props}>
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      <div className={clsx("p-4 rounded-3xl", innerClassName)}>
        {isLoading || isFetching ? <LoadingSpinner /> : children}
      </div>
    </div>
  );
};

export default Card;