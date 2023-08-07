/*
    TODO LIST (READY FOR PRODUCTION):
        - Allow for sorting by alphabetical, chronological first, last
        - Update cards so that they are same size.           


*/
//import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Header, Footer } from './components.js';

const CLIENT_ID = process.env.REACT_APP_ID;
const CLIENT_SECRET = process.env.REACT_APP_SECRET;

// UI constants
const SEARCH_DISPLAY_TEXT = "Displaying results for: ";


export default function App() {
    const [searchInput, setSearchInput] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [searchedArtist, setSearchedArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    
    // Basic React syntax for something that is run once (i.e. '() => {}')
    useEffect(() => {
        try {
            // API Access Token
            var authParameters = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
            }
            
            // TODO: Handle fetch errors 
            fetch('https://accounts.spotify.com/api/token', authParameters)
                .then(result => result.json())
                .then(data => setAccessToken(data.access_token))
        } catch (error) {
            console.error("Error fetching data: ", error); 
        }}, []);

    // Core application logic button
    async function search() {
        // Log console
        console.log("Search for " + searchInput);

        // Get request using search to get the Artist ID
        var searchParameters = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization':'Bearer ' + accessToken
            },
        }
        try {
            var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
                .then(response => response.json())
                .then(data => { return data.artists.items[0].id }) // 'return' statement assigns to variable before await/fetch

            console.log("Artist ID is " + artistID)

            // Get request with Artist ID grab all the albums from that artist
            var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums/?include_groups=album&market=US&limit=50', searchParameters)
                .then(response => response.json())
                .then(data => {
                    setAlbums(data.items);
                    console.log(returnedAlbums);
                })

            // Get the artist name
            var artistName = await fetch('https://api.spotify.com/v1/artists/' + artistID, searchParameters)
                .then(response => response.json())
                .then(data => {
                    setSearchedArtist(data);
                    console.log(artistName)
                })

            } catch (error) {
                console.error("Error fetching albums: ", error);
            }

    }

    function _printData(albumsList, artistData) {
        if (albumsList != null){
            // Comment for prod
            console.log("Albums: ")
            console.log(albumsList);
        }
        if (artistData != null) {
            console.log("Searched artist: ")
            console.log(artistData);
        }
    }
    _printData(albums, searchedArtist);
    
    return (
        <div className="App mt-4 px-3">
            {/*
                    H
            */}
            <Container>
                <Header />
            </Container>

            {/*
                    Search bar on top of page 
            */}
            <Container>
                <InputGroup className="m-3" size="lg">
                    <FormControl 
                        placeholder="Search an artist..."
                        type="input"
                        onKeyPress={event => {
                            if (event.key === "Enter") {
                                search();
                            }
                        }}
                        onChange={event => setSearchInput(event.target.value)}
                    />
                    <Button onClick={search}>
                        Search
                    </Button>
                </InputGroup>
            </Container>

            <Container className="grid">
                {/* 

                    Display name of artist being searched  

                */}
                <Row className="row">{searchedArtist ? <p className="text-start h5 fw-lighter">{SEARCH_DISPLAY_TEXT}<small>{searchedArtist.name}</small></p> : ""}</Row>
                {/*

                    Cardlist of all the artist's Albums
                
                */}
                <Row className="row row-cols-lg-4 row-cols-sm-1">
                    {albums.map( (album, index) => {
                        return (
                            <div className="col-md-3" key={index}>
                                <Card className="p-2 m-2"> 
                                    <a href={album.external_urls['spotify']}>
                                        <Card.Img src={album.images[0].url} /></a>
                                    <Card.Body>
                                        <Card.Title className="">{album.name}</Card.Title>
                                        <Card.Text className="">{searchedArtist ? <p>Release date: {album.release_date}</p> : ""}</Card.Text>
                                        <Card.Text className="">{searchedArtist ? <p>Tracks: {album.total_tracks}</p> : ""}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                        )
                    })}
                </Row>
            </Container>

            {/* 
                Footer 
            */}
            <Container>
                <Footer />
            </Container>
        </div>
    );
}
