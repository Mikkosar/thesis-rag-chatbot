// src/components/data/data-components/dataHeaders.tsx
// Yksinkertainen otsikkokomponentti

type HeadersProps = {
    title: string; // Otsikon teksti
}

const Header = ({ title }: HeadersProps) => {
    return (
        <h1 className="font-bold text-black justify-item justify-center flex text-xl">{title}</h1>
    );
}

export default Header