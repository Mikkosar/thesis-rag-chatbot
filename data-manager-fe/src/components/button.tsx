// src/components/button.tsx
// Uudelleenkäytettävä Button-komponentti eri väreillä ja tyypeillä

// Button-komponentin props-tyyppi
type ButtonProps = {
  type?: "button" | "submit" | "reset"; // HTML button-tyyppi
  onClick?: () => void; // Klikkauksen käsittelijä
  text?: string; // Painikkeen teksti
  color?: string; // Painikkeen väri (gray, green, red)
};

const Button = ({ type, onClick, text, color }: ButtonProps) => {
  return (
    <button
      type={type}
      className={
        // Määritetään CSS-luokat värien perusteella
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
