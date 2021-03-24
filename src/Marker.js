import { useEffect, useState } from 'react';
import './marker.css';

const units = {
  percent: '%',
  pixel: 'px'
};

const Marker = ({ datatype, image, text, time, paused, start, end, ...props }) => {
  const [visible, setVisible] = useState(false);
  const { x_value, x_unit, y_value, y_unit, textcolor, backcolor, bold, italic } = props;
  const transform = `translate(${x_value || 0}${units[x_unit]}, ${
    y_value || 0
  }${units[y_unit]})`;

  let styles = {
    color: textcolor,
    backgroundColor: backcolor,
    fontWeight: bold ? 'bold' : undefined,
    fontStyle: italic ? 'italic' : undefined
  };
  if (datatype === 'text') {
    styles.transform = transform;
  } else {
    styles = { transform };
  }

  useEffect(() => {
    if (!visible && time >= start && time < end) {
      setVisible(true);
    }
    if (visible && time >= end) {
      setVisible(false);
    }
  }, [time, end, start, visible]);

  if (paused === undefined || !visible) return null;

  return (
    <div className="marker" style={styles}>
      {datatype === 'text' && text}
      {datatype === 'image' && <span><img src={image} alt='' /></span>}
    </div>
  );
};

export default Marker;