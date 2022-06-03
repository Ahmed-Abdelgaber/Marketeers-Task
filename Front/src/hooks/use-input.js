import { useState } from 'react';

const useInput = valueValidationFunction => {
    const [enteredValue, setEnteredValue] = useState('');
    const [isTouched, setIsTouched] = useState(false);

    const isValidValue = valueValidationFunction(enteredValue);
    const hasError = !isValidValue && isTouched;

    const valueChangeHandler = event => {
        setIsTouched(true);
        setEnteredValue(event.target.value);
    };

    const valueBlurHandler = event => {
        setIsTouched(true);
    };

    const reset = () => {
        setEnteredValue('');
        setIsTouched(false);
    };

    return {
        value: enteredValue,
        isValidValue,
        hasError,
        valueChangeHandler,
        valueBlurHandler,
        reset,
    };
};

export default useInput;
