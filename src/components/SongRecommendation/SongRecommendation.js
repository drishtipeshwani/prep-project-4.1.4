import { useState, useEffect } from "react";
import { Col, ListGroupItem, Row } from "react-bootstrap";
import ListGroup from 'react-bootstrap/ListGroup';
import "./SongRecommendation.css";

const SongRecommendation = (props) => {

    const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/playlists/";
    const ACCESS_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
    var accessToken = '';
    var playlistId = '';
    const [tracksData, setTracksData] = useState(null);
    playlistId = {
        Clear: "2Ub0SnonpnLgiWP9LQs5kO",
        Clouds: "3QrZOF8JmVADH0jl2DZv8r",
        Smoke: "7MWiSLhNiRaOXhRnFLo9wt",
        Rain: "7iQ4SQo7LG5ezVKXoeG9oZ",
        Haze: "6KXDlalFV1SqateTdKYgUD",
        Drizzle: "7wBB5LF1xfreBTOKNLllx8",
    }[props.options.weather[0].main] || '5xyhI355JcExXTV96m0CBp';

    const handleGetPlaylists = async () => {

        fetch(PLAYLISTS_ENDPOINT + playlistId + '/tracks?limit=10',
            { method: 'GET', headers: { "Authorization": `Bearer ${accessToken}` }, }
        )
            .then((result) => result.json()).then((response) => {

                var items = response.items;
                setTracksData(
                    items.map(({ track }) => ({
                        song: track.name,
                        artist: track.artists[0].name,
                        imageUrl: track.album.images[0].url
                    }))
                )
            }
            )
            .catch(console.error);
    };


    useEffect(() => {
        const _getToken = async () => {

            await fetch(ACCESS_TOKEN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(process.env.REACT_APP_SPOTIFY_CLIENT_ID + ':' + process.env.REACT_APP_SPOTIFY_CLIENT_SECRET, 'utf8').toString('base64')
                },
                body: 'grant_type=client_credentials'
            }).then((result) => result.json()).then((data) => {
                accessToken = data.access_token;

                handleGetPlaylists();
            }
            ).catch((error) => { console.error(error); });

        }
        _getToken()
    }, [tracksData]);

    return (
        <>
            <div className="Recommended Songs">
                <h2 className="Catchy Header">Listen Songs That Match Your Mood!</h2>
                <ListGroup>
                    {tracksData &&
                        tracksData.map((singleTrack) =>
                            <ListGroupItem>
                                <Row>
                                    <img src={singleTrack.imageUrl} alt='Cover Page of Song' className="songImage" />
                                    <Col>
                                        <h4>{singleTrack.song}</h4>
                                        <h5>{singleTrack.artist}</h5>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                        )
                    }
                </ListGroup>

            </div>

        </>
    );
};

export default SongRecommendation;
