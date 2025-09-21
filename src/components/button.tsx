type ButtonProps = {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  text?: string;
  color?: string;
};

const Button = ({ type, onClick, text, color }: ButtonProps) => {
  return (
    <button
      type={type}
      className={
        color === "gray"
          ? `rounded-md bg-black-600 px-3 py-1.5 text-sm font-medium text-black shadow-sm hover:bg-gray-300 transition`
          : color === "green"
          ? `rounded-md bg-black-600 px-3 py-1.5 text-sm font-medium text-black shadow-sm hover:bg-green-200 transition`
          : color === "red"
          ? `rounded-md bg-black-600 px-3 py-1.5 text-sm font-medium text-black shadow-sm hover:bg-red-300 transition`
          : `rounded-md bg-black-600 px-3 py-1.5 text-sm font-medium text-black shadow-sm hover:bg-gray-300 transition`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
