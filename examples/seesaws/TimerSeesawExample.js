const ginger = require('../../core/ginger')();

class Counter {
    constructor() {
        this.count = 0;

        this.increment = this.increment.bind(this); // Weird JS stuff to make sure `this` points to the Counter instance
    }

    increment() {
        this.count++;
    }
}

function logCount() {
    console.log(counter_instance.count);
}

const counter_instance = new Counter();
const seesaw_instance = ginger.seesaws.TimerSeesaw({
    interval: 3000,
    should_terminate: () => counter_instance.count >= 5,
    callbacks: [counter_instance.increment, logCount]
});