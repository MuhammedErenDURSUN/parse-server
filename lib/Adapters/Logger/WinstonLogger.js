'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = undefined;
exports.configureLogger = configureLogger;
exports.addTransport = addTransport;
exports.removeTransport = removeTransport;

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _winstonDailyRotateFile = require('winston-daily-rotate-file');

var _winstonDailyRotateFile2 = _interopRequireDefault(_winstonDailyRotateFile);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _defaults = require('../../defaults');

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _winston2.default.Logger();
const additionalTransports = [];

function updateTransports(options) {
  const transports = Object.assign({}, logger.transports);
  if (options) {
    const silent = options.silent;
    delete options.silent;
    if (_lodash2.default.isNull(options.dirname)) {
      delete transports['parse-server'];
      delete transports['parse-server-error'];
    } else if (!_lodash2.default.isUndefined(options.dirname)) {
      transports['parse-server'] = new _winstonDailyRotateFile2.default(Object.assign({}, {
        filename: 'parse-server.info',
        name: 'parse-server'
      }, options, { timestamp: true }));
      transports['parse-server-error'] = new _winstonDailyRotateFile2.default(Object.assign({}, {
        filename: 'parse-server.err',
        name: 'parse-server-error'
      }, options, { level: 'error', timestamp: true }));
    }

    transports.console = new _winston2.default.transports.Console(Object.assign({
      colorize: true,
      name: 'console',
      silent
    }, options));
  }
  // Mount the additional transports
  additionalTransports.forEach(transport => {
    transports[transport.name] = transport;
  });
  logger.configure({
    transports: _lodash2.default.values(transports)
  });
}

function configureLogger({
  logsFolder = _defaults2.default.logsFolder,
  jsonLogs = _defaults2.default.jsonLogs,
  logLevel = _winston2.default.level,
  verbose = _defaults2.default.verbose,
  silent = _defaults2.default.silent } = {}) {

  if (verbose) {
    logLevel = 'verbose';
  }

  _winston2.default.level = logLevel;
  const options = {};

  if (logsFolder) {
    if (!_path2.default.isAbsolute(logsFolder)) {
      logsFolder = _path2.default.resolve(process.cwd(), logsFolder);
    }
    try {
      _fs2.default.mkdirSync(logsFolder);
    } catch (e) {/* */}
  }
  options.dirname = logsFolder;
  options.level = logLevel;
  options.silent = silent;

  if (jsonLogs) {
    options.json = true;
    options.stringify = true;
  }
  updateTransports(options);
}

function addTransport(transport) {
  additionalTransports.push(transport);
  updateTransports();
}

function removeTransport(transport) {
  const transportName = typeof transport == 'string' ? transport : transport.name;
  const transports = Object.assign({}, logger.transports);
  delete transports[transportName];
  logger.configure({
    transports: _lodash2.default.values(transports)
  });
  _lodash2.default.remove(additionalTransports, transport => {
    return transport.name === transportName;
  });
}

exports.logger = logger;
exports.default = logger;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9BZGFwdGVycy9Mb2dnZXIvV2luc3RvbkxvZ2dlci5qcyJdLCJuYW1lcyI6WyJjb25maWd1cmVMb2dnZXIiLCJhZGRUcmFuc3BvcnQiLCJyZW1vdmVUcmFuc3BvcnQiLCJsb2dnZXIiLCJ3aW5zdG9uIiwiTG9nZ2VyIiwiYWRkaXRpb25hbFRyYW5zcG9ydHMiLCJ1cGRhdGVUcmFuc3BvcnRzIiwib3B0aW9ucyIsInRyYW5zcG9ydHMiLCJPYmplY3QiLCJhc3NpZ24iLCJzaWxlbnQiLCJfIiwiaXNOdWxsIiwiZGlybmFtZSIsImlzVW5kZWZpbmVkIiwiRGFpbHlSb3RhdGVGaWxlIiwiZmlsZW5hbWUiLCJuYW1lIiwidGltZXN0YW1wIiwibGV2ZWwiLCJjb25zb2xlIiwiQ29uc29sZSIsImNvbG9yaXplIiwiZm9yRWFjaCIsInRyYW5zcG9ydCIsImNvbmZpZ3VyZSIsInZhbHVlcyIsImxvZ3NGb2xkZXIiLCJkZWZhdWx0cyIsImpzb25Mb2dzIiwibG9nTGV2ZWwiLCJ2ZXJib3NlIiwicGF0aCIsImlzQWJzb2x1dGUiLCJyZXNvbHZlIiwicHJvY2VzcyIsImN3ZCIsImZzIiwibWtkaXJTeW5jIiwiZSIsImpzb24iLCJzdHJpbmdpZnkiLCJwdXNoIiwidHJhbnNwb3J0TmFtZSIsInJlbW92ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBK0NnQkEsZSxHQUFBQSxlO1FBaUNBQyxZLEdBQUFBLFk7UUFLQUMsZSxHQUFBQSxlOztBQXJGaEI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxNQUFNQyxTQUFTLElBQUlDLGtCQUFRQyxNQUFaLEVBQWY7QUFDQSxNQUFNQyx1QkFBdUIsRUFBN0I7O0FBRUEsU0FBU0MsZ0JBQVQsQ0FBMEJDLE9BQTFCLEVBQW1DO0FBQ2pDLFFBQU1DLGFBQWFDLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCUixPQUFPTSxVQUF6QixDQUFuQjtBQUNBLE1BQUlELE9BQUosRUFB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VVAsSUFBM0U7QUFDQSxRQUFNVixhQUFhQyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQlIsT0FBT00sVUFBekIsQ0FBbkI7QUFDQSxTQUFPQSxXQUFXb0MsYUFBWCxDQUFQO0FBQ0ExQyxTQUFPd0IsU0FBUCxDQUFpQjtBQUNmbEIsZ0JBQVlJLGlCQUFFZSxNQUFGLENBQVNuQixVQUFUO0FBREcsR0FBakI7QUFHQUksbUJBQUVpQyxNQUFGLENBQVN4QyxvQkFBVCxFQUFnQ29CLFNBQUQsSUFBZTtBQUM1QyxXQUFPQSxVQUFVUCxJQUFWLEtBQW1CMEIsYUFBMUI7QUFDRCxHQUZEO0FBR0Q7O1FBRVExQyxNLEdBQUFBLE07a0JBQ01BLE0iLCJmaWxlIjoiV2luc3RvbkxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB3aW5zdG9uIGZyb20gJ3dpbnN0b24nO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IERhaWx5Um90YXRlRmlsZSBmcm9tICd3aW5zdG9uLWRhaWx5LXJvdGF0ZS1maWxlJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgZGVmYXVsdHMgIGZyb20gJy4uLy4uL2RlZmF1bHRzJztcblxuY29uc3QgbG9nZ2VyID0gbmV3IHdpbnN0b24uTG9nZ2VyKCk7XG5jb25zdCBhZGRpdGlvbmFsVHJhbnNwb3J0cyA9IFtdO1xuXG5mdW5jdGlvbiB1cGRhdGVUcmFuc3BvcnRzKG9wdGlvbnMpIHtcbiAgY29uc3QgdHJhbnNwb3J0cyA9IE9iamVjdC5hc3NpZ24oe30sIGxvZ2dlci50cmFuc3BvcnRzKTtcbiAgaWYgKG9wdGlvbnMpIHtcbiAgICBjb25zdCBzaWxlbnQgPSBvcHRpb25zLnNpbGVudDtcbiAgICBkZWxldGUgb3B0aW9ucy5zaWxlbnQ7XG4gICAgaWYgKF8uaXNOdWxsKG9wdGlvbnMuZGlybmFtZSkpIHtcbiAgICAgIGRlbGV0ZSB0cmFuc3BvcnRzWydwYXJzZS1zZXJ2ZXInXTtcbiAgICAgIGRlbGV0ZSB0cmFuc3BvcnRzWydwYXJzZS1zZXJ2ZXItZXJyb3InXTtcbiAgICB9IGVsc2UgaWYgKCFfLmlzVW5kZWZpbmVkKG9wdGlvbnMuZGlybmFtZSkpIHtcbiAgICAgIHRyYW5zcG9ydHNbJ3BhcnNlLXNlcnZlciddID0gbmV3IChEYWlseVJvdGF0ZUZpbGUpKFxuICAgICAgICBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICAgICAgZmlsZW5hbWU6ICdwYXJzZS1zZXJ2ZXIuaW5mbycsXG4gICAgICAgICAgbmFtZTogJ3BhcnNlLXNlcnZlcicsXG4gICAgICAgIH0sIG9wdGlvbnMsIHsgdGltZXN0YW1wOiB0cnVlIH0pKTtcbiAgICAgIHRyYW5zcG9ydHNbJ3BhcnNlLXNlcnZlci1lcnJvciddID0gbmV3IChEYWlseVJvdGF0ZUZpbGUpKFxuICAgICAgICBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICAgICAgZmlsZW5hbWU6ICdwYXJzZS1zZXJ2ZXIuZXJyJyxcbiAgICAgICAgICBuYW1lOiAncGFyc2Utc2VydmVyLWVycm9yJyxcbiAgICAgICAgfSwgb3B0aW9ucywgeyBsZXZlbDogJ2Vycm9yJywgdGltZXN0YW1wOiB0cnVlICB9KSk7XG4gICAgfVxuXG4gICAgdHJhbnNwb3J0cy5jb25zb2xlID0gbmV3ICh3aW5zdG9uLnRyYW5zcG9ydHMuQ29uc29sZSkoXG4gICAgICBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgY29sb3JpemU6IHRydWUsXG4gICAgICAgIG5hbWU6ICdjb25zb2xlJyxcbiAgICAgICAgc2lsZW50XG4gICAgICB9LCBvcHRpb25zKSk7XG4gIH1cbiAgLy8gTW91bnQgdGhlIGFkZGl0aW9uYWwgdHJhbnNwb3J0c1xuICBhZGRpdGlvbmFsVHJhbnNwb3J0cy5mb3JFYWNoKCh0cmFuc3BvcnQpID0+IHtcbiAgICB0cmFuc3BvcnRzW3RyYW5zcG9ydC5uYW1lXSA9IHRyYW5zcG9ydDtcbiAgfSk7XG4gIGxvZ2dlci5jb25maWd1cmUoe1xuICAgIHRyYW5zcG9ydHM6IF8udmFsdWVzKHRyYW5zcG9ydHMpXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlTG9nZ2VyKHtcbiAgbG9nc0ZvbGRlciA9IGRlZmF1bHRzLmxvZ3NGb2xkZXIsXG4gIGpzb25Mb2dzID0gZGVmYXVsdHMuanNvbkxvZ3MsXG4gIGxvZ0xldmVsID0gd2luc3Rvbi5sZXZlbCxcbiAgdmVyYm9zZSA9IGRlZmF1bHRzLnZlcmJvc2UsXG4gIHNpbGVudCA9IGRlZmF1bHRzLnNpbGVudCB9ID0ge30pIHtcblxuICBpZiAodmVyYm9zZSkge1xuICAgIGxvZ0xldmVsID0gJ3ZlcmJvc2UnO1xuICB9XG5cbiAgd2luc3Rvbi5sZXZlbCA9IGxvZ0xldmVsO1xuICBjb25zdCBvcHRpb25zID0ge307XG5cbiAgaWYgKGxvZ3NGb2xkZXIpIHtcbiAgICBpZiAoIXBhdGguaXNBYnNvbHV0ZShsb2dzRm9sZGVyKSkge1xuICAgICAgbG9nc0ZvbGRlciA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBsb2dzRm9sZGVyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGZzLm1rZGlyU3luYyhsb2dzRm9sZGVyKTtcbiAgICB9IGNhdGNoIChlKSB7IC8qICovIH1cbiAgfVxuICBvcHRpb25zLmRpcm5hbWUgPSBsb2dzRm9sZGVyO1xuICBvcHRpb25zLmxldmVsID0gbG9nTGV2ZWw7XG4gIG9wdGlvbnMuc2lsZW50ID0gc2lsZW50O1xuXG4gIGlmIChqc29uTG9ncykge1xuICAgIG9wdGlvbnMuanNvbiA9IHRydWU7XG4gICAgb3B0aW9ucy5zdHJpbmdpZnkgPSB0cnVlO1xuICB9XG4gIHVwZGF0ZVRyYW5zcG9ydHMob3B0aW9ucyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRUcmFuc3BvcnQodHJhbnNwb3J0KSB7XG4gIGFkZGl0aW9uYWxUcmFuc3BvcnRzLnB1c2godHJhbnNwb3J0KTtcbiAgdXBkYXRlVHJhbnNwb3J0cygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlVHJhbnNwb3J0KHRyYW5zcG9ydCkge1xuICBjb25zdCB0cmFuc3BvcnROYW1lID0gdHlwZW9mIHRyYW5zcG9ydCA9PSAnc3RyaW5nJyA/IHRyYW5zcG9ydCA6IHRyYW5zcG9ydC5uYW1lO1xuICBjb25zdCB0cmFuc3BvcnRzID0gT2JqZWN0LmFzc2lnbih7fSwgbG9nZ2VyLnRyYW5zcG9ydHMpO1xuICBkZWxldGUgdHJhbnNwb3J0c1t0cmFuc3BvcnROYW1lXTtcbiAgbG9nZ2VyLmNvbmZpZ3VyZSh7XG4gICAgdHJhbnNwb3J0czogXy52YWx1ZXModHJhbnNwb3J0cylcbiAgfSk7XG4gIF8ucmVtb3ZlKGFkZGl0aW9uYWxUcmFuc3BvcnRzLCAodHJhbnNwb3J0KSA9PiB7XG4gICAgcmV0dXJuIHRyYW5zcG9ydC5uYW1lID09PSB0cmFuc3BvcnROYW1lO1xuICB9KTtcbn1cblxuZXhwb3J0IHsgbG9nZ2VyIH07XG5leHBvcnQgZGVmYXVsdCBsb2dnZXI7XG4iXX0=