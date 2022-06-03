import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInput from '../hooks/use-input';
import Cookies from 'js-cookie';

const SimpleInput = props => {
    let navigate = useNavigate();

    const {
        value: enteredName,
        isValidValue: enteredNameIsValid,
        hasError: nameInputHasError,
        valueChangeHandler: enteredNameChangeHandler,
        valueBlurHandler: enteredNameBlurHandler,
        reset: nameInputReset,
    } = useInput(value => value.trim().length > 4);

    const {
        value: enteredEmail,
        isValidValue: enteredEmailIsValid,
        hasError: emailInputHasError,
        valueChangeHandler: enteredEmailChangeHandler,
        valueBlurHandler: enteredEmailBlurHandler,
        reset: emailInputReset,
    } = useInput(value => value.includes('@'));

    const {
        value: enteredPassword,
        isValidValue: enteredPasswordIsValid,
        hasError: passwordInputHasError,
        valueChangeHandler: enteredPasswordChangeHandler,
        valueBlurHandler: enteredPasswordBlurHandler,
        reset: passwordInputReset,
    } = useInput(value => value.trim().length > 6);

    let formIsValid = false;

    if (enteredNameIsValid && enteredEmailIsValid && enteredPasswordIsValid) {
        formIsValid = true;
    }

    const onSubmitHandler = event => {
        event.preventDefault();

        if (nameInputHasError || emailInputHasError || passwordInputHasError) {
            return;
        }

        fetch('http://127.0.0.1:5000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username: enteredName,
                email: enteredEmail,
                password: enteredPassword,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then(response => response.json())
            .then(json => {
                Cookies.set('JWT', json.JWT);
                navigate('../data', { replace: true });
            });

        nameInputReset();
        emailInputReset();
        passwordInputReset();
    };

    const nameInputClasses = nameInputHasError
        ? 'form-control invalid'
        : 'form-control';

    const emailInputClasses = emailInputHasError
        ? 'form-control invalid'
        : 'form-control';

    const passwordInputClasses = passwordInputHasError
        ? 'form-control invalid'
        : 'form-control';

    return (
        <form onSubmit={onSubmitHandler}>
            <div className={nameInputClasses}>
                <label htmlFor="name">Your Name</label>
                <input
                    type="text"
                    id="name"
                    onChange={enteredNameChangeHandler}
                    onBlur={enteredNameBlurHandler}
                    value={enteredName}
                />
                {nameInputHasError && (
                    <p className="error-text">
                        Name Must Be Greater Than 4 Characters
                    </p>
                )}
            </div>
            <div className={emailInputClasses}>
                <label htmlFor="email">Your Email</label>
                <input
                    type="email"
                    id="email"
                    onChange={enteredEmailChangeHandler}
                    onBlur={enteredEmailBlurHandler}
                    value={enteredEmail}
                />
                {emailInputHasError && (
                    <p className="error-text">Please Provide a Valid Email</p>
                )}
            </div>
            <div className={passwordInputClasses}>
                <label htmlFor="password">Your Password</label>
                <input
                    type="password"
                    id="password"
                    onChange={enteredPasswordChangeHandler}
                    onBlur={enteredPasswordBlurHandler}
                    value={enteredPassword}
                />
                {passwordInputHasError && (
                    <p className="error-text">
                        Please Provide a Valid password
                    </p>
                )}
            </div>
            <div className="form-actions">
                <button disabled={!formIsValid}>Submit</button>
            </div>
        </form>
    );
};

export default SimpleInput;
