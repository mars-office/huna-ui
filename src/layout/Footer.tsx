// eslint-disable-next-line @typescript-eslint/no-explicit-any
const version: string = (window as any).hunaVersion;

const Footer = () => {
    return <>{version}</>
}

export default Footer;