'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PushWorker = undefined;

var _deepcopy = require('deepcopy');

var _deepcopy2 = _interopRequireDefault(_deepcopy);

var _AdaptableController = require('../Controllers/AdaptableController');

var _AdaptableController2 = _interopRequireDefault(_AdaptableController);

var _Auth = require('../Auth');

var _Config = require('../Config');

var _Config2 = _interopRequireDefault(_Config);

var _PushAdapter = require('../Adapters/Push/PushAdapter');

var _rest = require('../rest');

var _rest2 = _interopRequireDefault(_rest);

var _StatusHandler = require('../StatusHandler');

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _ParseMessageQueue = require('../ParseMessageQueue');

var _PushQueue = require('./PushQueue');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function groupByBadge(installations) {
  return installations.reduce((map, installation) => {
    const badge = installation.badge + '';
    map[badge] = map[badge] || [];
    map[badge].push(installation);
    return map;
  }, {});
}
// -disable-next
class PushWorker {

  constructor(pushAdapter, subscriberConfig = {}) {
    _AdaptableController2.default.validateAdapter(pushAdapter, this, _PushAdapter.PushAdapter);
    this.adapter = pushAdapter;

    this.channel = subscriberConfig.channel || _PushQueue.PushQueue.defaultPushChannel();
    this.subscriber = _ParseMessageQueue.ParseMessageQueue.createSubscriber(subscriberConfig);
    if (this.subscriber) {
      const subscriber = this.subscriber;
      subscriber.subscribe(this.channel);
      subscriber.on('message', (channel, messageStr) => {
        const workItem = JSON.parse(messageStr);
        this.getAndRun(workItem);
      });
    }
  }

  run({ body, query, pushStatus, applicationId, UTCOffset }) {
    const config = _Config2.default.get(applicationId);
    const auth = (0, _Auth.master)(config);
    const where = utils.applyDeviceTokenExists(query.where);
    delete query.where;
    pushStatus = (0, _StatusHandler.pushStatusHandler)(config, pushStatus.objectId);
    return _rest2.default.find(config, auth, '_Installation', where, query).then(({ results }) => {
      if (results.length == 0) {
        return pushStatus.trackSent(results);
      }
      return this.sendToAdapter(body, results, pushStatus, config, UTCOffset);
    });
  }

  sendToAdapter(body, installations, pushStatus, config, UTCOffset) {
    // Check if we have locales in the push body
    const locales = utils.getLocalesFromPush(body);
    if (locales.length > 0) {
      // Get all tranformed bodies for each locale
      const bodiesPerLocales = utils.bodiesPerLocales(body, locales);

      // Group installations on the specified locales (en, fr, default etc...)
      const grouppedInstallations = utils.groupByLocaleIdentifier(installations, locales);
      const promises = Object.keys(grouppedInstallations).map(locale => {
        const installations = grouppedInstallations[locale];
        const body = bodiesPerLocales[locale];
        return this.sendToAdapter(body, installations, pushStatus, config, UTCOffset);
      });
      return Promise.all(promises);
    }

    if (!utils.isPushIncrementing(body)) {
      _logger2.default.verbose(`Sending push to ${installations.length}`);
      return this.adapter.send(body, installations, pushStatus.objectId).then(results => {
        return pushStatus.trackSent(results, UTCOffset, undefined, installations.length - results.length).then(() => results);
      });
    }

    // Collect the badges to reduce the # of calls
    const badgeInstallationsMap = groupByBadge(installations);

    // Map the on the badges count and return the send result
    const promises = Object.keys(badgeInstallationsMap).map(badge => {
      const payload = (0, _deepcopy2.default)(body);
      payload.data.badge = parseInt(badge);
      const installations = badgeInstallationsMap[badge];
      return this.sendToAdapter(payload, installations, pushStatus, config, UTCOffset);
    });
    return Promise.all(promises);
  }

  getAndRun(workItem) {
    var _this = this;
    if (!_this.subscriber.run) {
      return _this.run(workItem);
    }
    return _this.subscriber.run(workItem).then(function (gotItem) {
      if (gotItem) {
        return _this.run(gotItem).then(function () {
          return _this.getAndRun(gotItem);
        });
      } else {
        return Promise.resolve();
      }
    });
  }
}

exports.PushWorker = PushWorker;
exports.default = PushWorker;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9QdXNoL1B1c2hXb3JrZXIuanMiXSwibmFtZXMiOlsidXRpbHMiLCJncm91cEJ5QmFkZ2UiLCJpbnN0YWxsYXRpb25zIiwicmVkdWNlIiwibWFwIiwiaW5zdGFsbGF0aW9uIiwiYmFkZ2UiLCJwdXNoIiwiUHVzaFdvcmtlciIsImNvbnN0cnVjdG9yIiwicHVzaEFkYXB0ZXIiLCJzdWJzY3JpYmVyQ29uZmlnIiwiQWRhcHRhYmxlQ29udHJvbGxlciIsInZhbGlkYXRlQWRhcHRlciIsIlB1c2hBZGFwdGVyIiwiYWRhcHRlciIsImNoYW5uZWwiLCJQdXNoUXVldWUiLCJkZWZhdWx0UHVzaENoYW5uZWwiLCJzdWJzY3JpYmVyIiwiUGFyc2VNZXNzYWdlUXVldWUiLCJjcmVhdGVTdWJzY3JpYmVyIiwic3Vic2NyaWJlIiwib24iLCJtZXNzYWdlU3RyIiwid29ya0l0ZW0iLCJKU09OIiwicGFyc2UiLCJnZXRBbmRSdW4iLCJydW4iLCJib2R5IiwicXVlcnkiLCJwdXNoU3RhdHVzIiwiYXBwbGljYXRpb25JZCIsIlVUQ09mZnNldCIsImNvbmZpZyIsIkNvbmZpZyIsImdldCIsImF1dGgiLCJ3aGVyZSIsImFwcGx5RGV2aWNlVG9rZW5FeGlzdHMiLCJvYmplY3RJZCIsInJlc3QiLCJmaW5kIiwidGhlbiIsInJlc3VsdHMiLCJsZW5ndGgiLCJ0cmFja1NlbnQiLCJzZW5kVG9BZGFwdGVyIiwibG9jYWxlcyIsImdldExvY2FsZXNGcm9tUHVzaCIsImJvZGllc1BlckxvY2FsZXMiLCJncm91cHBlZEluc3RhbGxhdGlvbnMiLCJncm91cEJ5TG9jYWxlSWRlbnRpZmllciIsInByb21pc2VzIiwiT2JqZWN0Iiwia2V5cyIsImxvY2FsZSIsIlByb21pc2UiLCJhbGwiLCJpc1B1c2hJbmNyZW1lbnRpbmciLCJsb2dnZXIiLCJ2ZXJib3NlIiwic2VuZCIsInVuZGVmaW5lZCIsImJhZGdlSW5zdGFsbGF0aW9uc01hcCIsInBheWxvYWQiLCJkYXRhIiwicGFyc2VJ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QVNwQyxJQUFULENBQWhCO0FBQ0FvQyxjQUFRQyxJQUFSLENBQWE3RCxLQUFiLEdBQXFCOEQsU0FBUzlELEtBQVQsQ0FBckI7QUFDQSxZQUFNSixnQkFBZ0IrRCxzQkFBc0IzRCxLQUF0QixDQUF0QjtBQUNBLGFBQU8sS0FBSzBDLGFBQUwsQ0FBbUJrQixPQUFuQixFQUE0QmhFLGFBQTVCLEVBQTJDOEIsVUFBM0MsRUFBdURHLE1BQXZELEVBQStERCxTQUEvRCxDQUFQO0FBQ0QsS0FMZ0IsQ0FBakI7QUFNQSxXQUFPd0IsUUFBUUMsR0FBUixDQUFZTCxRQUFaLENBQVA7QUFDRDs7QUFFRDFCLFlBQVVILFFBQVYsRUFBdUM7QUFDckMsUUFBSTRDLFFBQVEsSUFBWjtBQUNBLFFBQUksQ0FBQ0EsTUFBTWxELFVBQU4sQ0FBaUJVLEdBQXRCLEVBQTJCO0FBQ3pCLGFBQU93QyxNQUFNeEMsR0FBTixDQUFVSixRQUFWLENBQVA7QUFDRDtBQUNELFdBQU80QyxNQUFNbEQsVUFBTixDQUFpQlUsR0FBakIsQ0FBcUJKLFFBQXJCLEVBQStCbUIsSUFBL0IsQ0FBb0MsVUFBVTBCLE9BQVYsRUFBbUI7QUFDNUQsVUFBSUEsT0FBSixFQUFhO0FBQ1gsZUFBT0QsTUFBTXhDLEdBQU4sQ0FBVXlDLE9BQVYsRUFDSjFCLElBREksQ0FDQyxZQUFZO0FBQ2hCLGlCQUFPeUIsTUFBTXpDLFNBQU4sQ0FBZ0IwQyxPQUFoQixDQUFQO0FBQ0QsU0FISSxDQUFQO0FBSUQsT0FMRCxNQUtPO0FBQ0wsZUFBT1osUUFBUWEsT0FBUixFQUFQO0FBQ0Q7QUFDRixLQVRNLENBQVA7QUFVRDtBQXhGcUI7O1FBQVgvRCxVLEdBQUFBLFU7a0JBMkZFQSxVIiwiZmlsZSI6IlB1c2hXb3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuLy8gQGZsb3ctZGlzYWJsZS1uZXh0XG5pbXBvcnQgZGVlcGNvcHkgICAgICAgICAgICAgICBmcm9tICdkZWVwY29weSc7XG5pbXBvcnQgQWRhcHRhYmxlQ29udHJvbGxlciAgICBmcm9tICcuLi9Db250cm9sbGVycy9BZGFwdGFibGVDb250cm9sbGVyJztcbmltcG9ydCB7IG1hc3RlciB9ICAgICAgICAgICAgIGZyb20gJy4uL0F1dGgnO1xuaW1wb3J0IENvbmZpZyAgICAgICAgICAgICAgICAgZnJvbSAnLi4vQ29uZmlnJztcbmltcG9ydCB7IFB1c2hBZGFwdGVyIH0gICAgICAgIGZyb20gJy4uL0FkYXB0ZXJzL1B1c2gvUHVzaEFkYXB0ZXInO1xuaW1wb3J0IHJlc3QgICAgICAgICAgICAgICAgICAgZnJvbSAnLi4vcmVzdCc7XG5pbXBvcnQgeyBwdXNoU3RhdHVzSGFuZGxlciB9ICBmcm9tICcuLi9TdGF0dXNIYW5kbGVyJztcbmltcG9ydCAqIGFzIHV0aWxzICAgICAgICAgICAgIGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgUGFyc2VNZXNzYWdlUXVldWUgfSAgZnJvbSAnLi4vUGFyc2VNZXNzYWdlUXVldWUnO1xuaW1wb3J0IHsgUHVzaFF1ZXVlIH0gICAgICAgICAgZnJvbSAnLi9QdXNoUXVldWUnO1xuaW1wb3J0IGxvZ2dlciAgICAgICAgICAgICAgICAgZnJvbSAnLi4vbG9nZ2VyJztcblxuZnVuY3Rpb24gZ3JvdXBCeUJhZGdlKGluc3RhbGxhdGlvbnMpIHtcbiAgcmV0dXJuIGluc3RhbGxhdGlvbnMucmVkdWNlKChtYXAsIGluc3RhbGxhdGlvbikgPT4ge1xuICAgIGNvbnN0IGJhZGdlID0gaW5zdGFsbGF0aW9uLmJhZGdlICsgJyc7XG4gICAgbWFwW2JhZGdlXSA9IG1hcFtiYWRnZV0gfHwgW107XG4gICAgbWFwW2JhZGdlXS5wdXNoKGluc3RhbGxhdGlvbik7XG4gICAgcmV0dXJuIG1hcDtcbiAgfSwge30pO1xufVxuXG5leHBvcnQgY2xhc3MgUHVzaFdvcmtlciB7XG4gIHN1YnNjcmliZXI6IGFueTtcbiAgYWRhcHRlcjogYW55O1xuICBjaGFubmVsOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHVzaEFkYXB0ZXI6IFB1c2hBZGFwdGVyLCBzdWJzY3JpYmVyQ29uZmlnOiBhbnkgPSB7fSkge1xuICAgIEFkYXB0YWJsZUNvbnRyb2xsZXIudmFsaWRhdGVBZGFwdGVyKHB1c2hBZGFwdGVyLCB0aGlzLCBQdXNoQWRhcHRlcik7XG4gICAgdGhpcy5hZGFwdGVyID0gcHVzaEFkYXB0ZXI7XG5cbiAgICB0aGlzLmNoYW5uZWwgPSBzdWJzY3JpYmVyQ29uZmlnLmNoYW5uZWwgfHwgUHVzaFF1ZXVlLmRlZmF1bHRQdXNoQ2hhbm5lbCgpO1xuICAgIHRoaXMuc3Vic2NyaWJlciA9IFBhcnNlTWVzc2FnZVF1ZXVlLmNyZWF0ZVN1YnNjcmliZXIoc3Vic2NyaWJlckNvbmZpZyk7XG4gICAgaWYgKHRoaXMuc3Vic2NyaWJlcikge1xuICAgICAgY29uc3Qgc3Vic2NyaWJlciA9IHRoaXMuc3Vic2NyaWJlcjtcbiAgICAgIHN1YnNjcmliZXIuc3Vic2NyaWJlKHRoaXMuY2hhbm5lbCk7XG4gICAgICBzdWJzY3JpYmVyLm9uKCdtZXNzYWdlJywgKGNoYW5uZWwsIG1lc3NhZ2VTdHIpID0+IHtcbiAgICAgICAgY29uc3Qgd29ya0l0ZW0gPSBKU09OLnBhcnNlKG1lc3NhZ2VTdHIpO1xuICAgICAgICB0aGlzLmdldEFuZFJ1bih3b3JrSXRlbSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBydW4oeyBib2R5LCBxdWVyeSwgcHVzaFN0YXR1cywgYXBwbGljYXRpb25JZCwgVVRDT2Zmc2V0IH06IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgY29uZmlnID0gQ29uZmlnLmdldChhcHBsaWNhdGlvbklkKTtcbiAgICBjb25zdCBhdXRoID0gbWFzdGVyKGNvbmZpZyk7XG4gICAgY29uc3Qgd2hlcmUgPSB1dGlscy5hcHBseURldmljZVRva2VuRXhpc3RzKHF1ZXJ5LndoZXJlKTtcbiAgICBkZWxldGUgcXVlcnkud2hlcmU7XG4gICAgcHVzaFN0YXR1cyA9IHB1c2hTdGF0dXNIYW5kbGVyKGNvbmZpZywgcHVzaFN0YXR1cy5vYmplY3RJZCk7XG4gICAgcmV0dXJuIHJlc3QuZmluZChjb25maWcsIGF1dGgsICdfSW5zdGFsbGF0aW9uJywgd2hlcmUsIHF1ZXJ5KS50aGVuKCh7cmVzdWx0c30pID0+IHtcbiAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHJldHVybiBwdXNoU3RhdHVzLnRyYWNrU2VudChyZXN1bHRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNlbmRUb0FkYXB0ZXIoYm9keSwgcmVzdWx0cywgcHVzaFN0YXR1cywgY29uZmlnLCBVVENPZmZzZXQpO1xuICAgIH0pO1xuICB9XG5cbiAgc2VuZFRvQWRhcHRlcihib2R5OiBhbnksIGluc3RhbGxhdGlvbnM6IGFueSwgcHVzaFN0YXR1czogYW55LCBjb25maWc6IENvbmZpZywgVVRDT2Zmc2V0OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIC8vIENoZWNrIGlmIHdlIGhhdmUgbG9jYWxlcyBpbiB0aGUgcHVzaCBib2R5XG4gICAgY29uc3QgbG9jYWxlcyA9IHV0aWxzLmdldExvY2FsZXNGcm9tUHVzaChib2R5KTtcbiAgICBpZiAobG9jYWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBHZXQgYWxsIHRyYW5mb3JtZWQgYm9kaWVzIGZvciBlYWNoIGxvY2FsZVxuICAgICAgY29uc3QgYm9kaWVzUGVyTG9jYWxlcyA9IHV0aWxzLmJvZGllc1BlckxvY2FsZXMoYm9keSwgbG9jYWxlcyk7XG5cbiAgICAgIC8vIEdyb3VwIGluc3RhbGxhdGlvbnMgb24gdGhlIHNwZWNpZmllZCBsb2NhbGVzIChlbiwgZnIsIGRlZmF1bHQgZXRjLi4uKVxuICAgICAgY29uc3QgZ3JvdXBwZWRJbnN0YWxsYXRpb25zID0gdXRpbHMuZ3JvdXBCeUxvY2FsZUlkZW50aWZpZXIoaW5zdGFsbGF0aW9ucywgbG9jYWxlcyk7XG4gICAgICBjb25zdCBwcm9taXNlcyA9IE9iamVjdC5rZXlzKGdyb3VwcGVkSW5zdGFsbGF0aW9ucykubWFwKChsb2NhbGUpID0+IHtcbiAgICAgICAgY29uc3QgaW5zdGFsbGF0aW9ucyA9IGdyb3VwcGVkSW5zdGFsbGF0aW9uc1tsb2NhbGVdO1xuICAgICAgICBjb25zdCBib2R5ID0gYm9kaWVzUGVyTG9jYWxlc1tsb2NhbGVdO1xuICAgICAgICByZXR1cm4gdGhpcy5zZW5kVG9BZGFwdGVyKGJvZHksIGluc3RhbGxhdGlvbnMsIHB1c2hTdGF0dXMsIGNvbmZpZywgVVRDT2Zmc2V0KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG5cbiAgICBpZiAoIXV0aWxzLmlzUHVzaEluY3JlbWVudGluZyhib2R5KSkge1xuICAgICAgbG9nZ2VyLnZlcmJvc2UoYFNlbmRpbmcgcHVzaCB0byAke2luc3RhbGxhdGlvbnMubGVuZ3RofWApO1xuICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5zZW5kKGJvZHksIGluc3RhbGxhdGlvbnMsIHB1c2hTdGF0dXMub2JqZWN0SWQpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgcmV0dXJuIHB1c2hTdGF0dXMudHJhY2tTZW50KHJlc3VsdHMsIFVUQ09mZnNldCwgdW5kZWZpbmVkLCBpbnN0YWxsYXRpb25zLmxlbmd0aCAtIHJlc3VsdHMubGVuZ3RoKVxuICAgICAgICAgIC50aGVuKCgpID0+IHJlc3VsdHMpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQ29sbGVjdCB0aGUgYmFkZ2VzIHRvIHJlZHVjZSB0aGUgIyBvZiBjYWxsc1xuICAgIGNvbnN0IGJhZGdlSW5zdGFsbGF0aW9uc01hcCA9IGdyb3VwQnlCYWRnZShpbnN0YWxsYXRpb25zKTtcblxuICAgIC8vIE1hcCB0aGUgb24gdGhlIGJhZGdlcyBjb3VudCBhbmQgcmV0dXJuIHRoZSBzZW5kIHJlc3VsdFxuICAgIGNvbnN0IHByb21pc2VzID0gT2JqZWN0LmtleXMoYmFkZ2VJbnN0YWxsYXRpb25zTWFwKS5tYXAoKGJhZGdlKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0gZGVlcGNvcHkoYm9keSk7XG4gICAgICBwYXlsb2FkLmRhdGEuYmFkZ2UgPSBwYXJzZUludChiYWRnZSk7XG4gICAgICBjb25zdCBpbnN0YWxsYXRpb25zID0gYmFkZ2VJbnN0YWxsYXRpb25zTWFwW2JhZGdlXTtcbiAgICAgIHJldHVybiB0aGlzLnNlbmRUb0FkYXB0ZXIocGF5bG9hZCwgaW5zdGFsbGF0aW9ucywgcHVzaFN0YXR1cywgY29uZmlnLCBVVENPZmZzZXQpO1xuICAgIH0pO1xuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gIH1cblxuICBnZXRBbmRSdW4od29ya0l0ZW06IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICBpZiAoIV90aGlzLnN1YnNjcmliZXIucnVuKSB7XG4gICAgICByZXR1cm4gX3RoaXMucnVuKHdvcmtJdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIF90aGlzLnN1YnNjcmliZXIucnVuKHdvcmtJdGVtKS50aGVuKGZ1bmN0aW9uIChnb3RJdGVtKSB7XG4gICAgICBpZiAoZ290SXRlbSkge1xuICAgICAgICByZXR1cm4gX3RoaXMucnVuKGdvdEl0ZW0pXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmdldEFuZFJ1bihnb3RJdGVtKVxuICAgICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHVzaFdvcmtlcjtcbiJdfQ==