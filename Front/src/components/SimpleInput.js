import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInput from '../hooks/use-input';
import Cookies from 'js-cookie';
import './SimpleInput.css';

const SimpleInput = props => {
    const [hasAccount, setHasAccount] = useState(false);
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

    let registerIsValid = false;
    let loginIsValid = false;

    if (enteredNameIsValid && enteredEmailIsValid && enteredPasswordIsValid) {
        registerIsValid = true;
    }

    if (enteredEmailIsValid && enteredPasswordIsValid) {
        loginIsValid = true;
    }

    const haveAccountHandler = () => {
        setHasAccount(true);
    };

    const createAccountHandler = () => {
        setHasAccount(false);
    };

    const onSubmitHandler = event => {
        event.preventDefault();

        if (hasAccount) {
            if (emailInputHasError || passwordInputHasError) {
                return;
            }

            fetch('http://127.0.0.1:5000/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
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

            emailInputReset();
            passwordInputReset();

            return;
        }

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
            {!hasAccount && (
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
            )}
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
                {!hasAccount && (
                    <button
                        onClick={haveAccountHandler}
                        className="have-account"
                    >
                        Already have account
                    </button>
                )}
                {!hasAccount && (
                    <button disabled={!registerIsValid}>Register</button>
                )}
                {hasAccount && (
                    <button
                        onClick={createAccountHandler}
                        className="have-account"
                    >
                        Create account
                    </button>
                )}
                {hasAccount && <button disabled={!loginIsValid}>Login</button>}
            </div>
        </form>
    );
};

export default SimpleInput;
