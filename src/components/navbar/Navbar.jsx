import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, userType, contextSignout } = useContext(AuthContext);
    return (
        <nav className={styles.navbar}>
            <Link to="/">Home</Link>
            {userType === 'admin' &&
            (
                <>
                    <Link to="/admin/dashboard">Admin</Link>
                    <Link to="/admin/customer">Customer</Link>
                </>
            )}
            {!isAuthenticated && <Link to="/auth">Sign in</Link>}
            {isAuthenticated && <Link to="/" onClick={contextSignout}>Sign out</Link>}
            
        </nav>
    );
};

export default Navbar;
