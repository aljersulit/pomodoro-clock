function Length(props) {
  return (
    <div className="duration-control">
      <div id={`${props.type}-label`}>{props.title}</div>
      <div className="control-flex">
        <button
          id={`${props.type}-decrement`}
          onClick={() => props.changeTime(-60, props.type)}
          disabled={props.timerOn}
        >
          <i className="fa-solid fa-arrow-down"></i>
        </button>
        <div id={`${props.type}-length`}>{Math.floor(props.time / 60)}</div>
        <button
          id={`${props.type}-increment`}
          onClick={() => props.changeTime(60, props.type)}
          disabled={props.timerOn}
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      </div>
    </div>
  );
}

export default Length;
