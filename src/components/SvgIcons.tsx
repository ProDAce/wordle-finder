type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

type SvgIconsProps = {
    name: "check" | "circle" | "cross" | "reset"
    width?: string | number
    height?: string | number
    color?: RGB | RGBA | HEX
    // class?: string
    // style?: React.CSSProperties
}

function SvgIcons(props: SvgIconsProps) {

    const icons: Record<string, JSX.Element> = {
        check: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height={props.height || "24px"}
                width={props.width || "24px"}
                viewBox="0 -960 960 960"
                fill={props.color || "#000000"}>
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
        ),
        circle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height={props.height || "24px"}
                width={props.width || "24px"}
                viewBox="0 -960 960 960"
                fill={props.color || "#000000"}>
                <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
            </svg>
        ),
        cross: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height={props.height || "24px"}
                width={props.width || "24px"}
                viewBox="0 -960 960 960"
                fill={props.color || "#000000"}>
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
        ),
        reset: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height={props.height || "24px"}
                width={props.width || "24px"}
                viewBox="0 -960 960 960"
                fill={props.color || "#000000"}>
                <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
            </svg>
        )
    }
    return (
        <>{icons[props.name]}</>
    );
}

export default SvgIcons;