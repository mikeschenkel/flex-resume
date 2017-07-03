'use-strict';

const moment = require('moment');

module.exports.register = function (handlebars) {
  handlebars.registerHelper('formatDate', (date) => {
    return moment(date.toString(), ['YYYY-MM-DD']).format('MMMM YYYY');
  });
};
