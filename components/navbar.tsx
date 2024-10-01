import "@/styles/custom.css";

export const Navbar = () => {
    return (
        <div>
            <nav>
                <NavbarBrand href="/" name="V A U L T"/>
            </nav>
        </div>
    )
}

interface NavbarBrandProps {
    name: string;
    href: string;
}

const NavbarBrand: React.FC<NavbarBrandProps> = ({ name, href }) => {
    return (
        <div className="brand"><a href={href}>{name}</a></div>
    );
};

interface NavbarLinkProps {
    name: string;
    href: string;
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ name, href }) => {
    return (
        <a className="link" href={href}>{name}</a>
    );
};