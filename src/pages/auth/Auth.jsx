import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { signin, signup } from '../../api/auth';
import { toast } from 'react-toastify';
import styles from './Auth.module.css';

const Auth = () => {
    const navigate = useNavigate();
    const { contextSignin } = useContext(AuthContext);

    const [isSignin, setIsSignin] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);

    const checkboxRef = useRef(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await signup(
                formData.username,
                formData.email,
                formData.password,
                formData.phone
            );

            console.log(response);

            toast.success('Account created successfully! Please sign in.');
            checkboxRef.current.checked = true;
            setIsSignin(true); // Also update state to match
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Registration failed';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await signin(formData.username, formData.password);
            console.log(response);
            toast.success('Sign in successful!');
            contextSignin(
                response.data.id,
                response.data.username,
                response.data.username,
                response.data.phone,
                response.data.userType
            );

            // Redirect to appropriate dashboard
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Sign in failed';
            toast.error(errorMsg);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authWrapper}>
            <div className={styles.main}>
                <input
                    type="checkbox"
                    id="chk"
                    className={styles.chk}
                    aria-hidden="true"
                    ref={checkboxRef}
                    onChange={(e) => setIsSignin(e.target.checked)}
                />

                <div className={styles.signup}>
                    <form onSubmit={handleSignup}>
                        <label htmlFor="chk" aria-hidden="true">Sign up</label>

                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"

                            required
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                        />

                        <button 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading && isSignin === false ? 'Processing...' : 'Sign up'}
                        </button>
                    </form>
                </div>

                <div className={styles.signin}>
                    <form onSubmit={handleSignin}>
                        <label htmlFor="chk" aria-hidden="true">Signin</label>

                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <button 
                            type="submit"
                            disabled={loading}
                        >
                            {loading && isSignin ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;