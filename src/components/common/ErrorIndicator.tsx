import { useState } from "react";
import ErrorIcon  from "../Svg/error_icon.svg?react";
import { PopUp } from "./PopUp";

interface Props {
    message?: string,
    styles: any
}

export const ErrorIndicator: React.FC<Props> = (props) => {
    const [showMessage, setShowMessage] = useState<boolean>(false);

    const showErrorMessage = () => {
        setShowMessage(!showMessage);
    }

    return(
        <div>
            <ErrorIcon style={props.styles.errorIcon} onClick={showErrorMessage}/>
            {showMessage && <PopUp styles={props.styles.popUp}/>}
        </div>
    )
}