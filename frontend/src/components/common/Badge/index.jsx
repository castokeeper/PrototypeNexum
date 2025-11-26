const Badge = ({ children, variant = 'default' }) => {
    const variantStyles = {
        success: {
            backgroundColor: 'rgb(220, 252, 231)',
            color: 'rgb(22, 163, 74)',
            borderColor: 'rgb(187, 247, 208)'
        },
        warning: {
            backgroundColor: 'rgb(254, 243, 199)',
            color: 'rgb(217, 119, 6)',
            borderColor: 'rgb(253, 230, 138)'
        },
        error: {
            backgroundColor: 'rgb(254, 226, 226)',
            color: 'rgb(220, 38, 38)',
            borderColor: 'rgb(254, 202, 202)'
        },
        info: {
            backgroundColor: 'rgb(219, 234, 254)',
            color: 'rgb(37, 99, 235)',
            borderColor: 'rgb(191, 219, 254)'
        },
        default: {
            backgroundColor: 'rgb(241, 245, 249)',
            color: 'rgb(71, 85, 105)',
            borderColor: 'rgb(226, 232, 240)'
        }
    };

    const style = variantStyles[variant] || variantStyles.default;

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600',
                border: `1px solid ${style.borderColor}`,
                ...style
            }}
        >
            {children}
        </span>
    );
};

export default Badge;
