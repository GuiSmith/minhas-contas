const Loading = () => (
    <div style={{position: 'fixed', bottom: '1em', left: '1em'}}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 50 50">
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="90 150"
                    strokeDashoffset="0"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 25 25"
                        to="360 25 25"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                </circle>
            </svg>
        </div>
    </div>
);

export default Loading;