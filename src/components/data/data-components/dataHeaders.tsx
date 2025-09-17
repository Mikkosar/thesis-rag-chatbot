type HeadersProps = {
    title: string;
}

const Header = ({ title }: HeadersProps) => {
    return (
        <h1 className="font-bold text-black justify-item justify-center flex text-xl">{title}</h1>
    );
}

export default Header