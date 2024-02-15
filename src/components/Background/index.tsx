
type Props = {
    children: React.ReactNode;
    className?: string;
};

const Background = (props: Props): React.ReactNode => {
    const { children, className } = props;
    return (
        <main className={className}>
            {children}
        </main>
    )
};

export default Background;
