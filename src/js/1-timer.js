import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


let userSelectedDate = null;
let countdownInterval = null;

const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerDisplay(days, hours, minutes, seconds) {
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

function updateTimer() {
  const currentTime = new Date();
  const timeDifference = userSelectedDate - currentTime;
  
  if (timeDifference <= 0) {
    clearInterval(countdownInterval);
    updateTimerDisplay(0, 0, 0, 0);
    datetimePicker.disabled = false;
    return;
  }
  
  const timeLeft = convertMs(timeDifference);
  updateTimerDisplay(timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds);
}

function startTimer() {
  if (!userSelectedDate) return;
  
  startButton.disabled = true;
  datetimePicker.disabled = true;
  
  updateTimer();
  countdownInterval = setInterval(updateTimer, 1000);
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates.length === 0) return;
    
    const selectedDate = selectedDates[0];
    const currentDate = new Date();
    
    if (selectedDate <= currentDate) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight'
      });
      userSelectedDate = null;
      startButton.disabled = true;
      return;
    }
    
    userSelectedDate = selectedDate;
    startButton.disabled = false;
  },
};

flatpickr("#datetime-picker", options);

startButton.addEventListener('click', startTimer);

startButton.disabled = true;