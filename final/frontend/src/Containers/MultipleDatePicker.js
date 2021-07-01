import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import "../App.css";

import { Select, Calendar, Tag } from "antd";

function toValidArray(value) {
  const arr = Array.isArray(value) ? value : [value];

  return arr.filter(e => e != null && e !== undefined); // must be ==
}

const MultipleDatePicker = React.forwardRef((props, ref) => {
  const { onChange = () => {}, value, format = "YYYY/MM/DD" } = props;

  const arrValues = useMemo(() => toValidArray(value), [value]);

  const customRenderDate = useCallback(
    current => {
      if (arrValues.some(e => current.isSame(e))) {
        return <div className={"selectedDate"}>{current.format("DD")}</div>;
      }

      return <div>{current.format("DD")}</div>;
    },
    [arrValues]
  );

  const renderTag = useCallback(
    ({ value, onClose }) => {
      return (
        <Tag onClose={onClose} closable>
          {value?.format(format)}
        </Tag>
      );
    },
    [format]
  );

  const _onChange = useCallback(
    selected => {
      const index = arrValues.findIndex(e => e.isSame(selected));
      const temp = [...arrValues];

      if (index !== -1) {
        temp.splice(index, 1);
      } else {
        temp.push(selected);
      }
      onChange(temp);
    },
    [arrValues, onChange]
  );

  const onDeselect = useCallback(
    oldSelect => {
      const newVal = arrValues.filter(e => !e.isSame(oldSelect));
      onChange(newVal);
    },
    [arrValues, onChange]
  );

  return (
    <Select
      className="select"
      mode="multiple"
      value={arrValues}
      placeholder="Choose avaliable dates"
      dropdownMatchSelectWidth={false}
      onDeselect={onDeselect}
      tagRender={renderTag}
      dropdownRender={() => {
        return (
          <div className={"calendar"}>
            <Calendar
              fullscreen={false}
              dateFullCellRender={customRenderDate}
              onSelect={_onChange}
            />
          </div>
        );
      }}
    />
  );
});

MultipleDatePicker.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.object
  ]),
  format: PropTypes.string
};

export default MultipleDatePicker;