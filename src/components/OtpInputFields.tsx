/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react"

type OtpProps = {
    length: number
    value: string | string[]
    placeholder?: string
    separator?: string | number | React.ReactNode
    inputType?: "number" | "text"
    case?: "upper" | "lower"
    inputSeparator?: React.Component
    // outputType?: "string" | "array" | "object"
    outputType?: "string" | "array"
    width?: string | number
    height?: string | number
    onComplete?: (value: string | number | string[] | number[]) => void | null
    onChange?: (value: string | string[], lastInput: string, index: number) => void | null
    class?: string
    style?: React.CSSProperties
}

function OtpInputFields(props: OtpProps) {
    function getValueFromProps() {
        if (typeof props.value === "string") {
            return props.value.split("")
        } else {
            return props.value
        }
    }
    console.log(props.value);
    const [inputVal, setInputVal] = useState<Array<string>>(getValueFromProps());
    const [atFocus, setAtFocus] = useState<number>(0);
    const inputRef = useRef<(HTMLInputElement | null)[]>(Array(props.length).fill(null));

    useEffect(() => {
        setInputVal(new Array(props.length).fill(undefined))
    }, [props.length])

    useEffect(() => {
        if (getValueFromProps().join("").toLowerCase() != inputVal.join("").toLowerCase()) {
            setInputVal(getValueFromProps())
        }
    }, [props.value])

    useEffect(() => {
        if (inputVal.join('').trim().length === props.length && props.onComplete != null) {
            const newInputVal: string | number | string[] = handleOutput(inputVal)
            // let newInputVal: string | number | string[] = [];
            // if (props.outputType == null || props.outputType === "string") {
            //     newInputVal = inputVal.join('').trim()
            // } else if (props.outputType === "array") {
            //     newInputVal = inputVal
            // }
            props.onComplete(newInputVal)
        }
    }, [inputVal])

    const getValue = (index: number) => {
        return inputVal[index] || "";
    }

    const handleOnFocus = (event: React.FocusEvent<HTMLInputElement, Element>, index: number) => {
        setAtFocus(index)
        event.target.select()
    }

    const changeAtFocus = (lastValue: string, pointer: number) => {
        const arr = [...inputVal];
        arr[atFocus] = lastValue
        if (props.onChange != null) {
            const newValue: string | string[] = handleOutput(arr);
            // let newValue: string | string[] = "";
            // if (props.outputType == null || props.outputType === "string") {
            //     newValue = arr.join('').trim()
            // } else if (props.outputType === "array") {
            //     newValue = arr
            // }
            props.onChange(newValue, lastValue, atFocus)
        }
        setInputVal(arr)
        if (atFocus + pointer >= 0 && atFocus + pointer < props.length) {
            inputRef.current[atFocus + pointer]?.focus();
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === "Backspace") {
            event.preventDefault();
            changeAtFocus("", -1)
        } else if (event.code === "Delete") {
            event.preventDefault();
            changeAtFocus("", 0)
        } else if (event.code === "ArrowLeft") {
            event.preventDefault();
            if (atFocus > 0) {
                inputRef.current[atFocus - 1]?.focus();
            }
        } else if (event.code === "ArrowRight") {
            event.preventDefault();
            if (atFocus < props.length) {
                inputRef.current[atFocus + 1]?.focus();
            }
        } else if (event.code === "Space") {
            event.preventDefault();
        }
    }

    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
        const nativeEvent = event.nativeEvent as InputEvent;
        if (props.inputType === "number" && Number(nativeEvent.data)) {
            changeAtFocus(nativeEvent.data || "", 1)
        } else if (props.inputType === "text") {
            const newValue: string = handleCase(nativeEvent.data) || "";
            changeAtFocus(newValue, 1)
        }
    }

    const handleCase = (char: string | null | undefined): string => {
        if (char == null || char == undefined) {
            return ""
        }
        if (props.case === "lower") {
            return char.toLowerCase();
        } else if (props.case === "upper") {
            return char.toUpperCase()
        }
        return ""
    }

    const handleOutput = (arr: string[]): string | string[] => {
        if (props.outputType == null || props.outputType === "string") {
            return arr.join('').trim()
            // } else (props.outputType === "array"){
        } else {
            return arr
        }
    }

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pastedValue = event.clipboardData.getData('Text');
        if (pastedValue.length >= props.length) {
            const arr: string[] = [];
            for (let i = 0; i < props.length; i++) {
                arr.push(handleCase(pastedValue[i]))
            }
            const newValue: string | string[] = handleOutput(arr);
            setInputVal(arr)
            inputRef.current[atFocus]?.blur();
            if (props.onChange != null) {
                props.onChange(newValue, newValue[props.length - 1], props.length - 1);
            }
            // } else {
            //     const arr: string[] = [];
            //     for (let i = 0; i < props.length; i++) {
            //         if (i >= atFocus && i < props.length - atFocus) {
            //             arr.push(pastedValue[i - atFocus])
            //         } else {
            //             arr.push(inputVal[i] || "")
            //         }
            //     }
            //     setInputVal(arr)
            //     if (atFocus + pastedValue.length < props.length) {
            //         setAtFocus(atFocus + pastedValue.length)
            //         inputRef.current[atFocus + pastedValue.length]?.focus();
            //     } else {
            //         inputRef.current[atFocus]?.blur();
            //     }
        }
    };

    const handlePlaceholder = (index: number) => {
        if (props.placeholder) {
            if (props.placeholder.length < props.length) {
                return props.placeholder[0]
            } else {
                return props.placeholder[index]
            }
        }
        return ""
    }

    const setStyle = (): React.CSSProperties => {
        const style: React.CSSProperties = {
            margin: "4px",
            width: props.width ? (typeof props.width === "number" ? props.width + "px" : props.width) : "40px",
            height: props.height ? (typeof props.height === "number" ? props.height + "px" : props.height) : "40px",
            textAlign: "center",
            fontSize: "16px",
            border: "1px solid black",
            borderRadius: "4px",
            outline: "none"
        };

        for (const k in props.style) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            style[k] = props.style[k]
        }
        return style
    }

    return (
        <div className="otp-input-container">
            {Array.from({ length: props.length }).map((_, index) => (
                <React.Fragment key={index}>
                    <input
                        type={props.inputType || "text"}
                        value={getValue(index)}
                        ref={(ref) => { inputRef.current[index] = ref; }}
                        onFocus={(e) => handleOnFocus(e, index)}
                        min={0}
                        max={9}
                        placeholder={handlePlaceholder(index)}
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        style={setStyle()}
                        className={props.class || ""}
                    />
                    {props.separator}
                </ React.Fragment>
            ))}
        </div>
    );
}

export default OtpInputFields;