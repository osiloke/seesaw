import { EventEmitter } from 'events';

// Using a global emitter to pass data between API routes.
const emitter = new EventEmitter();

export default emitter;
