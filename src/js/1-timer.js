import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const refs = {
  startBtn: document.querySelector('[data-start]'), 
  input: document.querySelector('#datetime-picker'), 
  days: document.querySelector('[data-days]'),     
  hours: document.querySelector('[data-hours]'),   
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;
let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      
    if (selectedDates[0].getTime() <= Date.now()) {
        iziToast.show({
          message: 'Please choose a date in the future'
        });
        refs.startBtn.disabled = true;
        return;
    };

    refs.startBtn.disabled = false; 
    userSelectedDate = selectedDates[0];
  },
};

flatpickr("#datetime-picker", options);

refs.startBtn.addEventListener('click', e => {
  refs.startBtn.disabled = true;
  refs.input.disabled = true; 

  timerId = setInterval(() => {

    const currentTime = new Date();
    const difference = userSelectedDate - currentTime;

    if (difference <= 0) {
      clearInterval(timerId);        
      renderTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      refs.input.disabled = false;           
      return;                                 
    }

    const convertedObj = convertMs(difference);
    renderTimer(convertedObj);

    

  }, 1000);
})

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function renderTimer(obj) {
  refs.days.textContent = addLeadingZero(obj.days);
  refs.hours.textContent = addLeadingZero(obj.hours);
  refs.minutes.textContent = addLeadingZero(obj.minutes);
  refs.seconds.textContent = addLeadingZero(obj.seconds);
}
