import clsx from "clsx";

type ImgButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  src: string;
  alt: string;
  interclassName?: string;
};

const ImgButton = ({ src, alt, className, interclassName, ...props }: ImgButtonProps) => {
  return (
    <button className={clsx("cursor-pointer", className)} {...props}>
      <img src={src} alt={alt} className={clsx("w-full h-full", interclassName)} />
    </button>
  );
};

export default ImgButton;