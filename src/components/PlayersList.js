// Import necessary components and libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarC from './Navbar';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import "../styles/PlayersList.css"; // Import custom styles

const PlayersList = () => {
    const [players, setPlayers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [editedPlayer, setEditedPlayer] = useState({ name: '', ranking: '', height: '' });
    const [loading, setLoading] = useState(true); // State to manage loading state
    // eslint-disable-next-line
    const [error, setError] = useState(null); // State to manage error state
    const [searchQuery, setSearchQuery] = useState(''); // State to store search query

    // Fetch the list of players when the component mounts
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
            const token =  localStorage.getItem('token')

                // Make a GET request to fetch the list of players
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/players`,{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // Set the list of players in the state
                setPlayers(response.data);
                setLoading(false); // Set loading state to false
            } catch (error) {
                console.error('Error fetching players:', error);
                setError(error); // Set error state
                setLoading(false); // Set loading state to false
            }
        };

        // Call the fetchPlayers function
        fetchPlayers();
    }, []); // Run this effect only once when the component mounts

    // Function to open the modal and set the selected player details
    const openModal = (player) => {
        setSelectedPlayer(player);
        setEditedPlayer(player ? { ...player } : { name: '', ranking: '', height: '' }); // Set initial values for editing or adding new player
        setShowModal(true);
    };

    // Function to handle changes in input fields for editing player details
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedPlayer({ ...editedPlayer, [name]: value });
    };

    // Function to submit edited player details
  // Function to submit edited player details
const handleSubmit = async () => {
    try {
        const token =  localStorage.getItem('token')
        // If selectedPlayer exists, it means we're editing an existing player
        if (selectedPlayer) {
            // Make a PUT request to update the player details
            await axios.put(`${process.env.REACT_APP_BASE_URL}/edit-player/${selectedPlayer._id}`, editedPlayer,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } else {
            // Otherwise, it's a new player being added
            await axios.post(`${process.env.REACT_APP_BASE_URL}/add-player`, editedPlayer,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
        // Refresh the list of players
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/players`,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setPlayers(response.data);
        // Close the modal
        setShowModal(false);
    } catch (error) {
        console.error('Error updating/adding player:', error);
    }
};


    // Function to delete a player by ID
    const deletePlayer = async (id) => {
        try {
            const token =  localStorage.getItem('token')
            // Make a DELETE request to delete the player by ID
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/players/${id}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                 }
            });
            // Filter out the deleted player from the list
            setPlayers(players.filter(player => player._id !== id));
        } catch (error) {
            console.error('Error deleting player:', error);
        }
    };

    // Function to handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filter players based on search query
    const filteredPlayers = players.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // JSX to render search input, players list, and modal
    return (
        <>
            <NavbarC />
            <Container>
                {/* Show loading indicator if loading */}
                {loading && <h1  style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}  >Loading...</h1>}
                
                {/* Search input */}
                <Form.Group  controlId="search"
                 style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", height: "auto" , padding:"10px 0" }}
                
                >
                {/* Add Player Button */}
                <Button variant="success" onClick={() => openModal(null)}>Add Player</Button>

                    <Form.Control
                        type="text"
                        placeholder="Search players by name"
                        value={searchQuery}
                        onChange={handleSearchChange}
                 style={{ width: "30%"}}
                        
                    />
                </Form.Group>


                {/* Players list */}
                {filteredPlayers.length === 0 && !loading ? (
                    <div>No players found</div>
                ) : (
                    <Table bordered hover responsive className="players-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Ranking</th>
                                <th>Height</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Map over the filtered list of players and render each player */}
                            {filteredPlayers.map((player) => (
                                <tr key={player._id}>
                                    <td>{player.name}</td>
                                    <td>{player.ranking}</td>
                                    <td>{player.height}</td>
                                    <td>
                                        {/* Buttons to edit and delete players */}
                                        <Button variant="info" size="sm" onClick={() => openModal(player)}>Edit</Button>
                                        <Button variant="danger" size="sm" onClick={() => deletePlayer(player._id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

                {/* Modal for editing player details */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedPlayer ? 'Edit Player' : 'Add Player'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={editedPlayer.name}
                                    onChange={handleInputChange}
                                    placeholder="Name"
                                />
                            </Form.Group>
                            <Form.Group controlId="formRanking">
                                <Form.Label>Ranking</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ranking"
                                    value={editedPlayer.ranking}
                                    onChange={handleInputChange}
                                    placeholder="Ranking"
                                />
                            </Form.Group>
                            <Form.Group controlId="formHeight">
                                <Form.Label>Height</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="height"
                                    value={editedPlayer.height}
                                    onChange={handleInputChange}
                                    placeholder="Height"
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSubmit}>{selectedPlayer ? 'Save changes' : 'Add Player'}</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default PlayersList;
