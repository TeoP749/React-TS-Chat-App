function UsernameSelection(props: { setSelectedUsername: (username: string) => void }) {
    const { setSelectedUsername } = props;
    return (
        <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body flex items-center">
                <h2 className="card-title">Welcome!</h2>
                <p>Please select a username</p>
                <input type="text" placeholder="John Doe" className="input input-bordered w-full max-w-xs" onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        const target: HTMLInputElement = e.target as HTMLInputElement;
                        if (target.value !== null && target.value.trim() !== "") {
                            setSelectedUsername((e.target as HTMLInputElement).value);
                        } else {
                            alert("empty username");
                        }
                        target.value = "";
                    }
                }} />
            </div>
        </div>
    );
}

export default UsernameSelection;