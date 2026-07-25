interface Props {
    message?: string,
    styles: any
}

export const PopUp: React.FC<Props> = (props) => {

    const styles = props.styles;

    return (
        <div style={styles.wrapper}>
            {props.message}
        </div>
    )
}