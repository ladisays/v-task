import { useState } from 'react';
import { useSocket } from './socket';
import { schema } from './utils';
import { Form, Field } from './Form';

const initialValues = {
  datatype: 'text',
  text: '',
  image: '',
  start: '',
  end: '',
  x_value: '',
  x_unit: 'pixel',
  y_value: '',
  y_unit: 'pixel',
  textcolor: '#000000',
  backcolor: '#FFFFFF',
  bold: false,
  italic: false
};

const units = [
  { value: 'pixel', label: 'px' },
  { value: 'percent', label: '%' }
];
const types = [
  { value: 'text', label: 'Text' },
  { value: 'image', label: 'Image' }
];

const VideoForm = () => {
  const [isImage, setIsImage] = useState(false);
  const { send } = useSocket();
  const onSubmit = (values) => {
    try {
      send({
        ...values,
        type: 'marker'
      });
      setIsImage(false);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="video-form">
      <Form initialValues={initialValues} schema={schema} onSubmit={onSubmit}>
        {({ values, setValues }) => {
          const handleTypeChange = (e) => {
            const { name, value } = e.target;
            setValues((s) => ({
              ...s,
              [name]: value,
            }));
            setIsImage(value === types[1].value);
          };
          const handleFile = (e) => {
            const { name, files } = e.target;
            const file = files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
              setValues((s) => ({
                ...s,
                [name]: reader.result
              }));
            };
            reader.readAsDataURL(file);
          };
          return (
            <>
              <Field
                name="datatype"
                label="Select type"
                as="select"
                onChange={handleTypeChange}
                options={types}
              />
              {isImage ? (
                <div className="image">
                  <label htmlFor="image" className="box">Browse File...</label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    onChange={handleFile}
                    value=""
                    className="field"
                  />
                  {values.image && <div className="img"><img src={values.image} alt="" /></div>}
                </div>
              ) : (
                <Field
                  name="text"
                  label="Caption"
                  placeholder="e.g This is my caption"
                />
              )}
              <Field
                name="start"
                label="Start time"
                placeholder="00:00"
                className="w-50"
              />
              <Field
                name="end"
                label="End time"
                placeholder="0"
                className="w-50"
              />
              {!isImage && (
                <>
                  <Field
                    name="x_value"
                    label="X position"
                    placeholder="0"
                    className="w-50"
                  />
                  <Field
                    name="x_unit"
                    label="X unit"
                    as="select"
                    options={units}
                    className="w-50"
                  />
                  <Field
                    name="y_value"
                    label="Y position"
                    placeholder="0"
                    className="w-50"
                  />
                  <Field
                    name="y_unit"
                    label="Y unit"
                    as="select"
                    options={units}
                    className="w-50"
                  />
                  <Field
                    name="textcolor"
                    type="color"
                    label="Color"
                    className="w-50"
                  />
                  <Field
                    name="backcolor"
                    type="color"
                    label="Background color"
                    className="w-50"
                  />
                  <Field name="bold" type="checkbox" label="Bold" />
                  <Field name="italic" type="checkbox" label="Italic" />
                </>
              )}
              <button type="submit">Send</button>
            </>
          );
        }}
      </Form>
    </div>
  );
};

export default VideoForm;
