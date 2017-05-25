
const ONE_SECOND = 1000;

/**
 * Timer for counting how many seconds elapsed.
 */
class Timer {

  /**
   * Creates a timer.
   * @param {function} callback - callback to invoke for every elapsed second 
   */
  constructor(callback) {
    this.callback = callback;
    this.isRunning = false;
    this.interval = 0;
    this.elapsed = 0;
  }

  /**
   * Starts the timer
   */
  start() {
    this.isRunning = true;
    this.interval = setInterval(() => {
      this.elapsed++;
      this.callback(this.elapsed);
    }, ONE_SECOND);
  }

  /**
   * Stops the timer
   */
  stop() {
    this.isRunning = false;
    clearInterval(this.interval);
    this.interval = 0;
  }

  /**
   * Resets the timer
   */
  reset() {
    this.stop();
    this.elapsed = 0;
    this.callback(this.elapsed);
  }

}

export {
  Timer
};

export default Timer;
