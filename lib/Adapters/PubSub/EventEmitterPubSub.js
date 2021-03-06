'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventEmitterPubSub = undefined;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const emitter = new _events2.default.EventEmitter();

class Publisher {

  constructor(emitter) {
    this.emitter = emitter;
  }

  publish(channel, message) {
    this.emitter.emit(channel, message);
  }
}

class Subscriber extends _events2.default.EventEmitter {

  constructor(emitter) {
    super();
    this.emitter = emitter;
    this.subscriptions = new Map();
  }

  subscribe(channel) {
    const handler = message => {
      this.emit('message', channel, message);
    };
    this.subscriptions.set(channel, handler);
    this.emitter.on(channel, handler);
  }

  unsubscribe(channel) {
    if (!this.subscriptions.has(channel)) {
      return;
    }
    this.emitter.removeListener(channel, this.subscriptions.get(channel));
    this.subscriptions.delete(channel);
  }
}

function createPublisher() {
  return new Publisher(emitter);
}

function createSubscriber() {
  return new Subscriber(emitter);
}

const EventEmitterPubSub = {
  createPublisher,
  createSubscriber
};

exports.EventEmitterPubSub = EventEmitterPubSub;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9BZGFwdGVycy9QdWJTdWIvRXZlbnRFbWl0dGVyUHViU3ViLmpzIl0sIm5hbWVzIjpbImVtaXR0ZXIiLCJldmVudHMiLCJFdmVudEVtaXR0ZXIiLCJQdWJsaXNoZXIiLCJjb25zdHJ1Y3RvciIsInB1Ymxpc2giLCJjaGFubmVsIiwibWVzc2FnZSIsImVtaXQiLCJTdWJzY3JpYmVyIiwic3Vic2NyaXB0aW9ucyIsIk1hcCIsInN1YnNjcmliZSIsImhhbmRsZXIiLCJzZXQiLCJvbiIsInVuc3Vic2NyaWJlIiwiaGFzIiwicmVtb3ZlTGlzdGVuZXIiLCJnZXQiLCJkZWxldGUiLCJjcmVhdGVQdWJsaXNoZXIiLCJjcmVhdGVTdWJzY3JpYmVyIiwiRXZlbnRFbWl0dGVyUHViU3ViIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztBQUVBLE1BQU1BLFVBQVUsSUFBSUMsaUJBQU9DLFlBQVgsRUFBaEI7O0FBRUEsTUFBTUMsU0FBTixDQUFnQjs7QUFHZEMsY0FBWUosT0FBWixFQUEwQjtBQUN4QixTQUFLQSxPQUFMLEdBQWVBLE9BQWY7QUFDRDs7QUFFREssVUFBUUMsT0FBUixFQUF5QkMsT0FBekIsRUFBZ0Q7QUFDOUMsU0FBS1AsT0FBTCxDQUFhUSxJQUFiLENBQWtCRixPQUFsQixFQUEyQkMsT0FBM0I7QUFDRDtBQVRhOztBQVloQixNQUFNRSxVQUFOLFNBQXlCUixpQkFBT0MsWUFBaEMsQ0FBNkM7O0FBSTNDRSxjQUFZSixPQUFaLEVBQTBCO0FBQ3hCO0FBQ0EsU0FBS0EsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsU0FBS1UsYUFBTCxHQUFxQixJQUFJQyxHQUFKLEVBQXJCO0FBQ0Q7O0FBRURDLFlBQVVOLE9BQVYsRUFBaUM7QUFDL0IsVUFBTU8sVUFBV04sT0FBRCxJQUFhO0FBQzNCLFdBQUtDLElBQUwsQ0FBVSxTQUFWLEVBQXFCRixPQUFyQixFQUE4QkMsT0FBOUI7QUFDRCxLQUZEO0FBR0EsU0FBS0csYUFBTCxDQUFtQkksR0FBbkIsQ0FBdUJSLE9BQXZCLEVBQWdDTyxPQUFoQztBQUNBLFNBQUtiLE9BQUwsQ0FBYWUsRUFBYixDQUFnQlQsT0FBaEIsRUFBeUJPLE9BQXpCO0FBQ0Q7O0FBRURHLGNBQVlWLE9BQVosRUFBbUM7QUFDakMsUUFBSSxDQUFDLEtBQUtJLGFBQUwsQ0FBbUJPLEdBQW5CLENBQXVCWCxPQUF2QixDQUFMLEVBQXNDO0FBQ3BDO0FBQ0Q7QUFDRCxTQUFLTixPQUFMLENBQWFrQixjQUFiLENBQTRCWixPQUE1QixFQUFxQyxLQUFLSSxhQUFMLENBQW1CUyxHQUFuQixDQUF1QmIsT0FBdkIsQ0FBckM7QUFDQSxTQUFLSSxhQUFMLENBQW1CVSxNQUFuQixDQUEwQmQsT0FBMUI7QUFDRDtBQXhCMEM7O0FBMkI3QyxTQUFTZSxlQUFULEdBQWdDO0FBQzlCLFNBQU8sSUFBSWxCLFNBQUosQ0FBY0gsT0FBZCxDQUFQO0FBQ0Q7O0FBRUQsU0FBU3NCLGdCQUFULEdBQWlDO0FBQy9CLFNBQU8sSUFBSWIsVUFBSixDQUFlVCxPQUFmLENBQVA7QUFDRDs7QUFFRCxNQUFNdUIscUJBQXFCO0FBQ3pCRixpQkFEeUI7QUFFekJDO0FBRnlCLENBQTNCOztRQU1FQyxrQixHQUFBQSxrQiIsImZpbGUiOiJFdmVudEVtaXR0ZXJQdWJTdWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cbmNvbnN0IGVtaXR0ZXIgPSBuZXcgZXZlbnRzLkV2ZW50RW1pdHRlcigpO1xuXG5jbGFzcyBQdWJsaXNoZXIge1xuICBlbWl0dGVyOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoZW1pdHRlcjogYW55KSB7XG4gICAgdGhpcy5lbWl0dGVyID0gZW1pdHRlcjtcbiAgfVxuXG4gIHB1Ymxpc2goY2hhbm5lbDogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdChjaGFubmVsLCBtZXNzYWdlKTtcbiAgfVxufVxuXG5jbGFzcyBTdWJzY3JpYmVyIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIGVtaXR0ZXI6IGFueTtcbiAgc3Vic2NyaXB0aW9uczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGVtaXR0ZXI6IGFueSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5lbWl0dGVyID0gZW1pdHRlcjtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBzdWJzY3JpYmUoY2hhbm5lbDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgaGFuZGxlciA9IChtZXNzYWdlKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoJ21lc3NhZ2UnLCBjaGFubmVsLCBtZXNzYWdlKTtcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnNldChjaGFubmVsLCBoYW5kbGVyKTtcbiAgICB0aGlzLmVtaXR0ZXIub24oY2hhbm5lbCwgaGFuZGxlcik7XG4gIH1cblxuICB1bnN1YnNjcmliZShjaGFubmVsOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc3Vic2NyaXB0aW9ucy5oYXMoY2hhbm5lbCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5lbWl0dGVyLnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIHRoaXMuc3Vic2NyaXB0aW9ucy5nZXQoY2hhbm5lbCkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kZWxldGUoY2hhbm5lbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlUHVibGlzaGVyKCk6IGFueSB7XG4gIHJldHVybiBuZXcgUHVibGlzaGVyKGVtaXR0ZXIpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTdWJzY3JpYmVyKCk6IGFueSB7XG4gIHJldHVybiBuZXcgU3Vic2NyaWJlcihlbWl0dGVyKTtcbn1cblxuY29uc3QgRXZlbnRFbWl0dGVyUHViU3ViID0ge1xuICBjcmVhdGVQdWJsaXNoZXIsXG4gIGNyZWF0ZVN1YnNjcmliZXJcbn1cblxuZXhwb3J0IHtcbiAgRXZlbnRFbWl0dGVyUHViU3ViXG59XG4iXX0=