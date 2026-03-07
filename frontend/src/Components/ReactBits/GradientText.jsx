export default function GradientText({
    children,
    className = '',
    colors = ['#a640ffff', '#2c37feff', '#a640ffff', '#4079ff', '#a640ffff'],
    animationSpeed = 8,
    showBorder = false
}) {
    const gradientStyle = {
        backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
        animationDuration: `${animationSpeed}s`
    };

    return (
        <div className={`animated-gradient-text ${className}`}>
            {showBorder && <div className="gradient-overlay" style={gradientStyle}></div>}
            <div className="text-content" style={gradientStyle}>
                {children}
            </div>
        </div>
    );
}

