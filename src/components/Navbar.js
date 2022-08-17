import React from 'react'

import { Link } from "react-router-dom"

export default function Navbar() {
    return (
        <nav className="nav">

            <Link to="/exercise1">Exercise One</Link>
            <Link to="/exercise2">Exercise Two</Link>

        </nav>
    )
}