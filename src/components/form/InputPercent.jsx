import React from "react";
import PropTypes from "prop-types";

class InputPercent extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    classes: PropTypes.string,
    placeholder: PropTypes.string,
    maxlength: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    changeEvent: PropTypes.func,
    textAlign: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    minVal: PropTypes.number,
    maxVal: PropTypes.number,
    desimal: PropTypes.bool,
    maxDecimalPlaceLen: PropTypes.number,
  };

  static defaultProps = {
    name: "",
    label: "",
    classes: "",
    placeholder: "",
    maxlength: "",
    value: "",
    changeEvent: () => {},
    textAlign: "",
    required: false,
    disabled: false,
    minVal: 0,
    maxVal: 100,
    desimal: false,
    maxDecimalPlaceLen: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      onFocus: false,
    };

    this.focusInput = this.focusInput.bind(this);
    this.blurInput = this.blurInput.bind(this);
    this.focusPseudo = this.focusPseudo.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  isNumeric = (value) => /^-{0,1}\d+$/.test(value);

  addThousandSeparator = (num) => {
    const newNumber = parseFloat(num);
    if (newNumber.toString().includes(".")) {
      const part = newNumber.toString().split(".");
      return `${part[0]
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")},${part[1]} %`;
    }
    return `${newNumber
      .toString()
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")} %`;
  };

  focusPseudo() {
    const { length } = this.realInput.value;
    this.realInput.focus();
    this.realInput.setSelectionRange(length, length);
  }

  focusInput() {
    this.setState({ onFocus: true });
  }

  blurInput(event) {
    const { changeEvent } = this.props;
    const { value } = event.target;
    changeEvent(parseFloat(value === "" ? 0 : value).toString());
    this.setState({ onFocus: false });
  }

  handleChange(event) {
    const { changeEvent, minVal, maxVal, desimal, maxDecimalPlaceLen } =
      this.props;
    let { value } = event.target;
    const rMatch = new RegExp(/^\d*\.?\d*$/);

    let numbericValue = this.isNumeric(value);
    if (desimal) {
      numbericValue = rMatch.test(value);
    }
    if (numbericValue && (value || 0) >= minVal && (value || 0) <= maxVal) {
      if (desimal && value.indexOf(".") > -1) {
        const splitNewValue = value.split(".");

        if (splitNewValue[1]) {
          let countDecimalPlace = maxDecimalPlaceLen;

          if (splitNewValue[1].length < maxDecimalPlaceLen) {
            countDecimalPlace = splitNewValue[1].length;
          }

          const delimiterRegex = new RegExp(
            `\\d+(?:\\.\\d{0,${countDecimalPlace}})?`
          );
          const rounded = value.match(delimiterRegex);
          ({ 0: value } = rounded);
        }

        if (value.length === 1) {
          value = "";
        }
      }
      changeEvent(value, event);
    }
  }

  render() {
    const {
      value,
      textAlign,
      classes,
      name,
      placeholder,
      required,
      disabled,
      maxlength,
    } = this.props;

    const valueNumber = value || "";
    const alignStyle = textAlign === undefined ? {} : { textAlign };

    return (
      <div className="currency-input-wrap">
        <input
          style={alignStyle}
          type="text"
          ref={(c) => {
            this.realInput = c;
          }}
          className={`form-control ${classes}`}
          name={name}
          onChange={(event) => this.handleChange(event)}
          placeholder={placeholder}
          value={valueNumber}
          required={!!required}
          onFocus={this.focusInput}
          onBlur={this.blurInput}
          disabled={disabled}
          maxLength={maxlength}
        />
      </div>
    );
  }
}

export default InputPercent;
