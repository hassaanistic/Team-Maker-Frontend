import React, { useState } from 'react';
import axios from 'axios';
import DropCollectionButton from './DropCollectionButton';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'; // Import Spinner component from react-bootstrap


import {toast } from 'react-toastify';
const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false); // State to track loading state
    const [error, setError] = useState(null); // State to track file type error

    const notifyfile = () => toast.success('File uploaded successfully!', {
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
        });
    
    const notifyfileErr = () => toast.error('Error uploading file!', {
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
        });

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setError(null); // Clear error if file type is correct
        } else {
            setFile(null);
            setError('Please select a CSV file.'); // Set error message for invalid file type
        }
    };

    const handleSubmit = async () => {
        setLoading(true); // Set loading state to true when uploading starts

        const formData = new FormData();
        formData.append('csvFile', file);

        const token = localStorage.getItem('token'); // Assuming you're storing the token in localStorage
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            console.log('File uploaded successfully:', response.data);
            notifyfile();

        } catch (error) {
            notifyfileErr();

            console.error('Error uploading file:', error);
        } finally {
            setLoading(false); // Set loading state to false when uploading completes (either success or error)
            
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.uploadContainer}>
                <h2 style={styles.heading}>Upload your CSV File</h2>
                <input type="file" onChange={handleFileChange} style={styles.fileInput} />
                {error && <p style={styles.error}>{error}</p>} {/* Display error message if file type is invalid */}
                <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "10px" }}>
                    {/* Conditional rendering of button content */}
                    {loading ? ( // If loading, show spinner
                        <Button style={styles.uploadButton} disabled>
                            <Spinner animation="border" size="sm" /> {/* Use Bootstrap Spinner component */}
                        </Button>
                    ) : ( // If not loading, show upload button
                        <Button onClick={handleSubmit} style={styles.uploadButton} disabled={!file}>
                            Upload
                        </Button>
                    )}
                    <DropCollectionButton />
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        width: '100%',
        height:'90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadContainer: {
        textAlign: 'center',
    },
    heading: {
        marginBottom: '20px',
        color: '#333',
    },
    fileInput: {
        display: 'block',
        margin: '0 auto',
        marginBottom: '20px',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    },
    uploadButton: {
        width: '150px',
    },
    error: {
        color: 'red',
        margin: '10px 0',
    }
};

export default FileUpload;
