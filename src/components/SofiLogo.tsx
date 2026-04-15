interface Props {
    size?: number;
    className?: string;
}

export default function SofiLogo({ size = 40, className = "" }: Props) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Outer rounded square */}
            <rect
                x="2"
                y="2"
                width="44"
                height="44"
                rx="12"
                className="fill-indigo-600/10 dark:fill-indigo-400/10 stroke-indigo-600 dark:stroke-indigo-400"
                strokeWidth="2"
            />
            {/* Shield / checkmark body */}
            <path
                d="M24 8C24 8 12 12 12 20C12 28 16 36 24 40C32 36 36 28 36 20C36 12 24 8 24 8Z"
                className="fill-indigo-600/20 dark:fill-indigo-400/20 stroke-indigo-600 dark:stroke-indigo-400"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            {/* Checkmark */}
            <path
                d="M18 24L22 28L30 18"
                className="stroke-indigo-600 dark:stroke-indigo-400"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
}
