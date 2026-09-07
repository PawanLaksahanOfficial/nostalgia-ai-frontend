interface Props {
    message?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    styles: any
}

export const PopUp: React.FC<Props> = (props) => {

    const styles = props.styles ?? {};

    return (
        <div style={styles.wrapper}>
            {props.message}
        </div>
    )
}