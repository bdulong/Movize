import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';

const Header = () => {
    return (
        <header>
            <nav>
                <ul><Link to="/"><img src={logo} alt="Logo" /></Link></ul>
            </nav>
        </header>
    );
}

export default Header;