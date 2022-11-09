const ButtonSpinner = ({ type, title, active, style, disabled, variant, size }) => {
  return (
    <button className={`btn btn-${variant ? variant : 'primary'} position-relative ${size && 'btn-'+size}`} type={type} title={title} style={style} disabled={disabled}>
      {
        active && 
        <span 
        className="position-absolute top-50 start-50"
        style={{
          transform: 'translate(-50%, -50%)'
        }}
        >
          <span 
            className="spinner-border spinner-border-sm"
          />
        </span>
      }
      <span className={`${active && 'invisible'}`}>{title}</span>
    </button>
  );
};

export default ButtonSpinner;