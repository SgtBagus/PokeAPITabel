import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class InputSelect extends PureComponent {
  constructor(props) {
    super(props);
    const { value } = props;

    this.state = {
      picked: typeof value !== "undefined",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (val, e) => {
    const { changeEvent } = this.props;

    this.setState(
      {
        picked: true,
      },
      () => {
        changeEvent(val, e);
      }
    );
  };

  generateOptions = (data) => {
    return data.map((option, index) => {
      if (typeof option === "object") {
        return (
          <option
            key={index}
            value={Object.values(option)[0]}
            disabled={option.disabled}
          >
            {Object.values(option)[1]}
          </option>
        );
      }
      return (
        <option key={index} value={option}>
          {option}
        </option>
      );
    });
  };

  render() {
    const {
      disabled, name, id, value,
      required, placeholder, data,
    } = this.props;
    const { picked } = this.state;

    return (
      <select
        name={name}
        id={id}
        className="form-control"
        value={value}
        required={!!required}
        onChange={(e) => this.handleChange(e.target.value, e)}
        disabled={disabled}
      >
        {!value && (
          <option className="placeholder" value="" disabled={picked}>
            {placeholder ? placeholder : "Pilihan"}
          </option>
        )}
        {this.generateOptions(data)}
      </select>
    );
  }
}

InputSelect.propTypes = {
  label: PropTypes.string,
  classes: PropTypes.string,
  placeholder: PropTypes.string,
  data: PropTypes.array.isRequired,
  bool: PropTypes.bool,
  changeEvent: PropTypes.func,
};

export default InputSelect;
