import './Button.css';

function Button(props: { onClick: () => void }) {
    const { onClick } = props;
    return (
        <button className="btn btn-primary mt-5" onClick={onClick}>Button</button>
    )
}

export default Button;