function Input({ label, type, value, id, required = false, onChange, error }) {
    return (
        <div className="mb-3">

            <label htmlFor={id} className="form-label" title={label}>{label}</label>
            <input type={type}className={`form-control ${error? 'is-invalid': ''}`} value={value} id={id} required={required} onChange={onChange} />
            <small className={`text-danger invalid-feedback`}>{error}</small>
        </div>
    );
}

export default Input;