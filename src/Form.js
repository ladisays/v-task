import React, { useState, useContext } from 'react';

import './form.css';

export const FormContext = React.createContext({
  values: {},
  errors: {},
  initialValues: {},
  setValues() {},
  setErrors() {},
  handleChange() {},
  handleBlur() {}
});

export const Form = ({ initialValues, schema, onSubmit, children }) => {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState(initialValues);
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setValues((s) => ({
      ...s,
      [name]: val
    }));
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    schema
      .validateAt(name, values)
      .then(() => {
        setErrors((errs) => ({
          ...errs,
          [name]: undefined,
        }));
      })
      .catch((e) => {
        setErrors((errs) => ({
          ...errs,
          [name]: e.message,
        }));
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    schema
      .validate(values, { abortEarly: false })
      .then((data) => {
        onSubmit(data);
        setErrors({});
        setValues(initialValues);
      })
      .catch((e) => {
        const errs = e.inner.reduce((acc, curr) => {
          if (curr.path && curr.message) {
            acc[curr.path] = curr.message;
          }
          return acc;
        }, {});

        setErrors(errs);
      });
  };
  const contextValue = {
    values,
    errors,
    initialValues,
    setValues,
    setErrors,
    handleChange,
    handleBlur
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form className="form" onSubmit={handleSubmit}>
        {typeof children === 'function' ?
          children({ values, errors, setValues, setErrors })
          : children
        }
      </form>
    </FormContext.Provider>
  )
};

export const Field = ({
  id = '',
  as = 'input',
  type = 'text',
  name,
  label = '',
  inline = false,
  className = '',
  options = [],
  children,
  ...rest
}) => {
  const { values, errors, handleChange, handleBlur } = useContext(FormContext);
  const value = values[name];
  const error = errors[name];
  if (!inline) {
    className += ' block';
  }
  const props = {
    id: id || name,
    name,
    type,
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    className: 'field',
    ...rest
  };
  let childNodes = [];

  if (as === 'select') {
    delete props.type;

    if (children !== undefined) {
      childNodes = children;
    } else if (Array.isArray(options) && options.length) {
      childNodes = options.map((option) =>
        React.createElement('option', { value: option.value }, option.label)
      );
    } else {
      childNodes = [];
    }
  }

  const control = React.createElement(as, props, ...childNodes);
 
  return (
    <div className={`field-group ${className}`} data-invalid={!!error}>
      <label htmlFor={id || name}>{label}</label>
      {control}
      {error && <p>{error}</p>}
    </div>
  );
};
