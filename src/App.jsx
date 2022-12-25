import { useState } from "react";
import Length from "./components/Length";
import alarm from "./assets/alarmsound.mp3";

function App() {
  const [timer, setTimer] = useState({
    displayTime: 25 * 60,
    onBreak: false,
  });
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [timerOn, setTimerOn] = useState(false);


  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  }

  function changeTime(amount, type) {
    if (type == "break") {
      if (breakTime <= 60 && amount < 0) {
        return;
      } else if (breakTime >= 3600 && amount > 0) {
        return;
      }
      setBreakTime((prevBT) => prevBT + amount);
    }
    if (type == "session") {
      if (sessionTime <= 60 && amount < 0) {
        return;
      } else if (sessionTime >= 3600 && amount > 0) {
        return;
      }
      setSessionTime((prevST) => prevST + amount);
      if (!timerOn) {
        setTimer((prev) => {
          return {
            ...prev,
            displayTime: sessionTime + amount,
          };
        });
      }
    }
  }

  function controlTime() {
    if (!timerOn) {
      let interval = setInterval(() => {
        setTimer((prev) => {
          const alarmSound = document.getElementById("beep");
          const app = document.getElementById("root");
          if (prev.displayTime <= 0 && !prev.onBreak) {
            alarmSound.play();
            app.style.animation = "animate 3s ease-in-out 1 forwards";
            return {
              ...prev,
              displayTime: breakTime,
              onBreak: true,
            };
          }
          if (prev.displayTime <= 0 && prev.onBreak) {
            alarmSound.play();
            app.style.animation = "animate2 3s ease-in-out 1 forwards";
            return {
              ...prev,
              displayTime: sessionTime,
              onBreak: false,
            };
          }
          return {
            ...prev,
            displayTime: prev.displayTime - 1,
          };
        });
      }, 1000);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  }

  function resetTime() {
    const alarmSound = document.getElementById("beep");
    alarmSound.pause();
    alarmSound.currentTime = 0;
    clearInterval(localStorage.getItem("interval-id"));
    setTimer({
      displayTime: 25 * 60,
      onBreak: false,
    });
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    setTimerOn(false);
  }

  return (
    <div className="App">
      <h1 className="title">Pomodoro Clock</h1>
      <Length
        title={"Break Length"}
        changeTime={changeTime}
        type={"break"}
        time={breakTime}
        formatTime={formatTime}
        timerOn={timerOn}
      />

      <Length
        title={"Session Length"}
        changeTime={changeTime}
        type={"session"}
        time={sessionTime}
        formatTime={formatTime}
        timerOn={timerOn}
      />

      <div className="timer">
        <div id="timer-label">{timer.onBreak ? "Break" : "Session"}</div>
        <div id="time-left">{formatTime(timer.displayTime)}</div>
        <audio id="beep">
          <source src={alarm} type="audio/mp3" />
        </audio>
      </div>

      <div className="timer-control">
        <button id="start_stop" onClick={controlTime}>
          {timerOn ? (
            <i className="fa-solid fa-pause"></i>
          ) : (
            <i className="fa-solid fa-play"></i>
          )}
        </button>
        <button id="reset" onClick={resetTime}>
          <i className="fa-solid fa-arrows-rotate"></i>
        </button>
      </div>
    </div>
  );
}

export default App;

