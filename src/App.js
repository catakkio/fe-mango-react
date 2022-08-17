import React from 'react'

import { Route, Routes } from 'react-router-dom';

import ExerciseOne from './pages/ExerciseOne'
import ExerciseTwo from './pages/ExerciseTwo';
import Navbar from './components/Navbar';

function App() {


    return (
        <div className="text-center">
            <Navbar />

            <Routes>
                <Route path="/exercise1" element={<ExerciseOne />} />
                <Route path="/exercise2" element={<ExerciseTwo />} />
            </Routes>
        </div>
    );

}

export default App;
