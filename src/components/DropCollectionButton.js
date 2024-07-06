import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DropCollectionButton = () => {
    const [loading, setLoading] = useState(false);

    const notify = () => toast.success('Success!', {
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
    });

    const notifyErr = () => toast.error('Error dropping collection!', {
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
    });

    const handleDropCollection = async () => {

        try {
            const token =  localStorage.getItem('token');
            setLoading(true);
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/drop-collection`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            notify();
        } catch (error) {
            notifyErr();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer
                position="bottom-center"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Button style={{ width: '150px' }} onClick={handleDropCollection} disabled={loading}>

                {loading ? (
                    <Spinner animation="border" size="sm" />
                ) : (
                    'Drop Collection'
                )}
            </Button>
        </>

    );
};

export default DropCollectionButton;
