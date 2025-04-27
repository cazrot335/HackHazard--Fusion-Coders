import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup';
import CodeEditor from './pages/CodeEditor';
import UserProtectWrapper from './pages/UserProtectWrapper';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
                path="/code-editor"
                element={
                    <UserProtectWrapper>
                        <CodeEditor />
                    </UserProtectWrapper>

                }
            />
        </Routes>
    );
};

export default App;
