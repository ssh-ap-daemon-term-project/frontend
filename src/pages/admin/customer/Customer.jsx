import React, { useEffect, useState } from 'react';
// Import your API function
import { getAllCustomers, deleteCustomer } from '../../../api/admin'; // Adjust this import path
import { toast } from 'react-toastify';

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Create an async function inside useEffect
        const loadCustomers = async () => {
            try {
                setLoading(true);
                const response = await getAllCustomers();
                setCustomers(response.data);
            } catch (err) {
                console.error("Failed to fetch customers:", err);
                toast.error(err.response?.data?.detail || 'Failed to fetch customers');
            } finally {
                setLoading(false);
            }
        };
        
        // Call the async function
        loadCustomers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteCustomer(id);
            setCustomers(customers.filter(customer => customer.id !== id));
        } catch (err) {
            console.error("Failed to delete customer:", err);
        }
    };
    
    return (
        <div>
            <h1>Customer Management</h1>
            
            {loading && <p>Loading customers...</p>}
            
            {!loading && customers.length === 0 && (
                <p>No customers found.</p>
            )}
            
            {!loading && customers.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.username}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td>
                                    <button onClick={() => handleDelete(customer.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Customer;