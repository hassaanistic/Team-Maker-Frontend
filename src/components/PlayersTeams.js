import React, { useState } from 'react';
import axios from 'axios';
import NavbarC from './Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import '../styles/PlayersTeams.css'; // Import custom styles for grid layout

import jsPDF from 'jspdf';
const PlayersTeams = () => {
    const [teams, setTeams] = useState([]);
    const [overallAverageHeight, setOverallAverageHeight] = useState(0);
    const [overallAverageRating, setOverallAverageRating] = useState(0);
    const [showRanking, setShowRanking] = useState(true); // State to track visibility of ranking
    const [showHeight, setShowHeight] = useState(true); // State to track visibility of height
    const [showAverages, setShowAverages] = useState(true); // State to track visibility of averages
    const [loading, setLoading] = useState(false); // State to track loading status


const exportToPDF = () => {
    // Create a new PDF document
    const doc = new jsPDF();

    // Set up initial x and y positions
    let xPos = 10;
    let yPos = 10;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Iterate over teams
    teams.forEach((team, index) => {
        // Calculate the width needed for the current team based on the number of columns
        const teamWidth = 50; // Adjust as needed

        // Check if adding the current team exceeds the page width
        if (xPos + teamWidth > pageWidth) {
            // Add a new row if the current team cannot fit on the current row
            xPos = 10; // Reset x position for new row
            yPos += 20; // Move y position down for new row

            // Check if adding the current team exceeds the page height
            if (yPos + 20 > pageHeight) {
                // Add a new page if the current team cannot fit on the current page
                doc.addPage();
                yPos = 10; // Reset y position for new page
            }
        }

        // Set up table headers (make heading bold)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        
        doc.text(`Team ${index + 1}`, xPos, yPos);
        doc.setLineWidth(0.1);
        yPos += 5; // Move y position down

        // Reset font style to normal
        doc.setFont("helvetica", "normal");

        // Set up table content
        team.forEach((player, playerIndex) => {
            const playerName = player.name;
            doc.text(playerName, xPos, yPos + playerIndex * 5); // Adjust spacing between player names as needed
        });

        // Update x position for next team
        xPos += teamWidth + 10; // Adjust spacing between teams as needed
    });

    // Save or download the PDF
    doc.save('teams.pdf');
};

const exportToCSV = () => {
    // Prepare CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    // Iterate over teams
    teams.forEach((team, index) => {
        // Add team name as the first column
        csvContent += `Team ${index + 1},`;

        // Add player names
        team.forEach((player, playerIndex) => {
            // Add player name
            csvContent += `${player.name}`;

            // Add comma if it's not the last player in the team
            if (playerIndex < team.length - 1) {
                csvContent += ",";
            }
        });

        // Add new line after each team
        csvContent += "\n";
    });

    // Encode CSV content
    const encodedURI = encodeURI(csvContent);

    // Create anchor element to trigger download
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "teams.csv");

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
};


    // Function to generate teams
    const generateTeams = async () => {
        try {
            setLoading(true); // Set loading state to true
            // Fetch player data from the server
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/players`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const players = response.data;
    
            // If no players are returned, display a message
            if (players.length === 0) {
                alert('No players added.');
                setTeams([]);
                setLoading(false); // Reset loading state
                return;
            }
    
            // Perform team generation logic
            const teams = generateBalancedTeams(players, 4);
    
            // Set the generated teams in the state
            setTeams(teams);
            setLoading(false); // Reset loading state
        } catch (error) {
            console.error('Error generating teams:', error);
            setLoading(false); // Reset loading state
        }
    };

    // Function to generate balanced teams
    const generateBalancedTeams = (players, teamSize) => {
        // Calculate overall average rating
        const overallAverageRating = calculateOverallAverageRating(players);
        setOverallAverageRating(overallAverageRating);

        // Calculate overall average height
        const overallAvgHeight = calculateOverallAverageHeight(players);
        setOverallAverageHeight(overallAvgHeight);
        
        // Sort players by ratings and then by height
        players.sort((a, b) => {
            if (a.ranking !== b.ranking) {
                return b.ranking - a.ranking; // Sort by rating
            } else {
                return b.height - a.height; // If ratings are equal, sort by height
            }
        });

        // Function to create balanced teams based on both rating and height
        const createBalancedTeams = () => {
            let teams = Array.from({ length: Math.ceil(players.length / teamSize) }, () => []);
            let direction = 1; // 1 for forward, -1 for reverse
            let teamIndex = 0;

            players.forEach(player => {
                teams[teamIndex].push(player);
                if (teamIndex === 0 && direction === -1) {
                    direction = 1;
                } else if (teamIndex === teams.length - 1 && direction === 1) {
                    direction = -1;
                } else {
                    teamIndex += direction;
                }
            });

            return teams;
        };

        return createBalancedTeams();
    };

    // Calculate overall average rating
    const calculateOverallAverageRating = (players) => {
        const totalRating = players.reduce((acc, player) => acc + player.ranking, 0);
        return totalRating / players.length;
    };

    // Calculate overall average height
    const calculateOverallAverageHeight = (players) => {
        const totalHeight = players.reduce((acc, player) => acc + player.height, 0);
        return totalHeight / players.length;
    };

    // Calculate team average rating
    const calculateTeamAverageRating = (team) => {
        const totalRating = team.reduce((acc, player) => acc + player.ranking, 0);
        return totalRating / team.length;
    };

    // Calculate team average height
    const calculateTeamAverageHeight = (team) => {
        const totalHeight = team.reduce((acc, player) => acc + player.height, 0);
        return totalHeight / team.length;
    };

    return (
        <>
            <NavbarC />
            <Container>
                <div style={{ marginTop: "20px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", height: "50px" }}>
                    <Button onClick={generateTeams}>{loading ? 'Generating...' : 'Generate Teams'}</Button>
                    <div style={{display:"flex" , gap:"10px"}}>
                        <Button onClick={() => setShowRanking(!showRanking)}>{showRanking ? 'Hide Ranking' : 'Show Ranking'}</Button>

                        <Button onClick={() => setShowHeight(!showHeight)}>{showHeight ? 'Hide Height' : 'Show Height'}</Button>

                        <Button onClick={() => setShowAverages(!showAverages)}>{showAverages ? 'Hide Averages' : 'Show Averages'}</Button>

                        <Button onClick={exportToPDF}>Export to PDF</Button>
                        <Button onClick={exportToCSV}>Export to Csv</Button>
                    </div>
                </div>

                {/* Display generated teams */}
                <div className="teams-grid">
                    {teams.map((team, index) => (
                        <div key={index} className="team">
                            <h4>Team {index + 1}</h4>
                            <ul>
                                {team.map(player => (
                                    <li key={player._id}>
                                        {player.name} {showRanking && `(Ranking: ${player.ranking})`} {showHeight && `(Height: ${player.height})`}
                                    </li>
                                ))}
                            </ul>
                            {showAverages && (
                                <>
                                    <span>Average Rating: {calculateTeamAverageRating(team).toFixed(2)} </span>
                                    <span style={{ fontSize: "12px", opacity: "0.7" }} >(Overall Rating Average: {overallAverageRating.toFixed(2)})</span>
                                    <br />
                                    <span>Average Height: {calculateTeamAverageHeight(team).toFixed(2)}</span>
                                    <span style={{ fontSize: "12px", opacity: "0.7" }}> (Overall Height Average: {overallAverageHeight.toFixed(2)})</span>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </Container>
        </>
    );
};

export default PlayersTeams;
