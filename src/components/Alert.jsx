function Alert(props) {
    return ( 
        <div className={`alert alert-${props.type}`}>
            {props.message}
        </div>
     );
}

export default Alert;