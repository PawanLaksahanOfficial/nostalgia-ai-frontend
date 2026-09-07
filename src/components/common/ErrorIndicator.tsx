import { useState } from "react";
import ErrorIcon  from "../Svg/error_icon.svg?react";
import { PopUp } from "./PopUp";

interface Props {
    message?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    styles: any
}

export const ErrorIndicator: React.FC<Props> = (props) => {
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const styles = props.styles ?? {};

    const showErrorMessage = () => {
        setShowMessage(!showMessage);
    }

    return(
        <div>
            <ErrorIcon style={styles.errorIcon} onClick={showErrorMessage}/>
            {showMessage && <PopUp message={props.message} styles={styles.popUp}/>}
        </div>
    )
}