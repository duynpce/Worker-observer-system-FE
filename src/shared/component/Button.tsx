import clsx from "clsx";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  content: string;
}

const Button = ({ content, className, ...props }: ButtonProps) => {
  return (
    <button className={clsx("bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer", className)} {...props}>
      {content}
    </button>
  )
}

export default Button;