import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';
import { Fragment } from 'react';

import './Table.css';

const Table = () => {
    const [data, setData] = useState([]);

    let navigate = useNavigate();

    const logoutHandler = () => {
        Cookies.remove('JWT');
        navigate('../login', { replace: true });
    };

    const inputHandler = event => {
        const row = data.filter(el => el.id == event.target.dataset.id)[0];

        const rowIndex = data.findIndex(el => el.id == event.target.dataset.id);

        let updatedData = [...data];

        updatedData[rowIndex].result = (
            (event.target.value / row.number) *
            100
        ).toFixed(2);

        setData(updatedData);
    };

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/data/getdata', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${Cookies.get('JWT')}`,
                withCredentials: true,
                'Access-Control-Allow-Headers': 'Authorization,Lang,',
            },
        })
            .then(response => response.json())
            .then(json => setData(json.data));
    }, []);

    return (
        <Fragment>
            <table>
                <thead>
                    <tr>
                        <th>input</th>
                        <th>number</th>
                        <th>result</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(el => {
                        return (
                            <tr key={el.number}>
                                <td>
                                    <input
                                        type="number"
                                        onChange={inputHandler}
                                        data-id={el.id}
                                    ></input>
                                </td>
                                <td>{el.number}</td>
                                <td>{el.result}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="form-actions">
                <button onClick={logoutHandler}>LogOut</button>
            </div>
        </Fragment>
    );
};

export default Table;
