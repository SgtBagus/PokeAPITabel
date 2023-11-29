import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class InputNumber extends PureComponent {
    static addThousandSeparator(num) {
        let newNumber = parseFloat(num);
        const part = newNumber.toString().split('.');

        if (part.length === 2) {
            ({ 0: newNumber } = part);
        }

        newNumber = newNumber.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');

        if (part.length === 2) {
            return `${newNumber},${part[1]}`;
        }

        return newNumber;
    }

    state = {
        isInputFocus: false,
    };

    focusPseudo = () => {
        const { length } = this.realInput.value;

        this.realInput.focus();
        this.realInput.setSelectionRange(length, length);
    }

    focusInput = () => {
        this.setState({ isInputFocus: true });
    }

    blurInput = () => {
        const { value, changeEvent } = this.props;
        this.setState({ isInputFocus: false }, () => {
            const newValue = String(parseFloat(String(value).length > 0 ? value : 0));
            changeEvent(newValue);
        });
    }

    handleChange = (event) => {
        const { value } = event.target;
        const { changeEvent, decimalPlace } = this.props;

        let newValue = String(value).replace(/^0(?!\.)|[^0-9.]/g, '');
        const idxDot = newValue.indexOf('.');

        if (!newValue && parseFloat(value) === 0) {
            newValue = value;
        }

        if (decimalPlace && idxDot > 0) {
            if (idxDot !== newValue.length - 1) {
                if (parseInt(newValue[idxDot + 1], 10) !== 0 || (parseInt(newValue[idxDot + 1], 10) === 0 && newValue.length - idxDot > 2)) {
                    if (String(newValue).indexOf('.') > -1) {
                        const splitNewValue = String(newValue).split('.');
                        const countDecimalPlace = splitNewValue[1] && String(splitNewValue[1]).length <= 4 ? String(splitNewValue[1]).length : 4;
                        if (String(splitNewValue[1]).length > 3 && parseFloat(splitNewValue[1]) !== 0) {
                            newValue = parseFloat(newValue);
                            newValue = newValue.toFixed(countDecimalPlace);
                        } else if (String(splitNewValue[1]).length > 3) {
                            newValue = parseFloat(newValue);
                        }
                    }
                }
            }
        } else if (newValue !== '') {
            newValue = parseInt(newValue, 10);
            newValue = Number.isNaN(newValue) ? 0 : newValue;
        }

        changeEvent(newValue, event);
    }

    render() {
        const {
            label: controlLabel, labelInfo, classes, name, required, placeholder, disabled, maxlength, value,
        } = this.props;
        const { isInputFocus } = this.state;

        const formatted = value ? this.constructor.addThousandSeparator(value) : '';

        let inputStyleClass = 'form-control';
        let inputViewStyleClass = 'pseudo-input';

        if (classes) {
            inputStyleClass = `${inputStyleClass} ${classes}`;
            inputViewStyleClass = `${inputViewStyleClass} ${classes}`;
        }

        return (
            <div className="form-group">
                {controlLabel
                    && (
                        <label className="control-label">
                            {controlLabel}
                            {labelInfo
                                && (
                                    <span>
                                        <span
                                            ref={(c) => { this.infoTips = c; }}
                                            data-for="info-tips"
                                            data-tip={labelInfo}
                                            data-event="click focus"
                                            style={{ fontFamily: 'HelveticaNeueCyr' }}
                                        >
                                            <i
                                                style={{
                                                    fontSize: '16px',
                                                    marginLeft: '4px',
                                                    verticalAlign: 'middle',
                                                }}
                                                className="fa fa-info-circle"
                                            />
                                        </span>
                                    </span>
                                )
                            }
                        </label>
                    )
                }
                <div className="currency-input-wrap">
                    <input
                        type="text"
                        ref={(c) => { this.realInput = c; }}
                        className={inputStyleClass}
                        name={name}
                        onChange={this.handleChange}
                        placeholder={placeholder}
                        value={value}
                        required={required}
                        onFocus={this.focusInput}
                        onBlur={this.blurInput}
                        disabled={disabled}
                        maxLength={maxlength}
                    />
                    {value !== ''
                    && (
                        <input
                            type="text"
                            className={inputViewStyleClass}
                            onClick={this.focusPseudo}
                            value={formatted}
                            style={{ visibility: isInputFocus ? 'hidden' : 'visible' }}
                            readOnly
                        />
                    )
                    }
                </div>
            </div>
        );
    }
}

InputNumber.propTypes = {
    label: PropTypes.string,
    classes: PropTypes.string,
    placeholder: PropTypes.string,
    maxlength: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    changeEvent: PropTypes.func,
    labelInfo: PropTypes.string,
    name: PropTypes.string,
    required: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]),
    disabled: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]),
    decimalPlace: PropTypes.bool,
};

InputNumber.defaultProps = {
    label: undefined,
    classes: undefined,
    placeholder: undefined,
    maxlength: undefined,
    value: '',
    changeEvent: () => {},
    labelInfo: undefined,
    name: undefined,
    required: undefined,
    disabled: undefined,
    decimalPlace: undefined,
};

export default InputNumber;
