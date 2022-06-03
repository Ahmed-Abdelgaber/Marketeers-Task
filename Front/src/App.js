import { Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import SimpleInput from './components/SimpleInput';
import Table from './components/Table';
function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="*" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<SimpleInput />} />
                <Route path="/data" element={<Table />} />
            </Routes>
        </div>
    );
}

export default App;
