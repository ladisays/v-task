const yup = require('yup');
const moment = require('moment');

const ACTIONS = {
  HIDE: 0,
  SHOW: 1,
};

const formats = ['m:ss', 's'];
const schema = yup.object({
  datatype: yup.string(),
  image: yup.string(),
  text: yup.string().trim(),
  textcolor: yup.string().trim(),
  backcolor: yup.string().trim(),
  x_value: yup.string(),
  x_unit: yup.string(),
  y_value: yup.string(),
  y_unit: yup.string(),
  bold: yup.bool(),
  italic: yup.bool(),
  start: yup
    .string()
    .trim()
    .required("Start time is required")
    .test("timestamp", "Start time is invalid", (value) =>
      moment(value, formats[0], true).isValid()
    ),
  end: yup
    .string()
    .trim()
    .required("End time is required")
    .test("timestamp", "End time is invalid", (value) =>
      moment(value, formats, true).isValid()
    ),
  // .test('isAfterStart', 'End time must be after start time', (value) => moment(value, formats, true).isAfter(moment()))
});

module.exports = {
  ACTIONS,
  formats,
  schema
};
