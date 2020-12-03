import React, { useState, useEffect } from "react";
import Dropdown from "../components/Dropdown";
import axios from "axios";
import Listbox from "../components/Listbox";
import { Button } from "../components/Button";

const Music = () => {
	const [token, setToken] = useState("");
	const [genres, setGenres] = useState({ selectedGenre: "", list: [] });
	const [playlists, setPlaylists] = useState({
		selectedPlaylist: "",
		list: []
	});
	const [tracks, setTracks] = useState({
		selectedTrack: "",
		list: []
	});
	const [trackDetail, setTrackDetail] = useState(null);

	useEffect(() => {
		axios.get("/spotify/genres").then(response => {
			const { token, genres } = response.data;
			setToken(token);
			setGenres({ selectedGenre: genres.selectedGenre, list: genres });
			console.log({ genres });
		});
	}, []);

	const genreChanged = val => {
		setGenres({ selectedGenre: val, list: genres.list });
		console.log({ token, val });
		axios
			.post("/spotify/playlists", { token, val })
			.then(response => {
				const { playlists } = response.data;
				setPlaylists({
					selectedPlaylist: playlists.selectedPlaylist,
					list: playlists
				});
				console.log({ playlists });
			})
			.catch(e => {
				console.log(e.message);
			});
	};
	const playlistChanged = val =>
		setPlaylists({ selectedPlaylist: val, list: playlists.list });
	const buttonClicked = e => {
		e.preventDefault();
		let { selectedPlaylist } = playlists;
		axios
			.post("/spotify/playlist", { token, selectedPlaylist })
			.then(response => {
				const { tracks } = response.data;
				setTracks({
					selectedTrack: tracks.selectedTrack,
					list: tracks
				});
				console.log({ tracks });
			});
	};
	const listboxClicked = val => {
		const currentTracks = [...tracks.list];
		const trackInfo = currentTracks.filter(t => t.track.id === val);
		setTrackDetail(trackInfo[0].track);
	};

	return (
		<form onSubmit={buttonClicked}>
			<Dropdown
				name="genre"
				selectedValue={genres.selectedValue}
				changed={genreChanged}
				placeholder="Genre"
				options={genres.list}
			/>
			<Dropdown
				name="playlist"
				selectedValue={playlists.selectedValue}
				changed={playlistChanged}
				placeholder="Playlist"
				options={playlists.list}
			/>
			<Button type="submit">Submit</Button>
			<Listbox items={tracks.list} clicked={listboxClicked} />
		</form>
	);
};

export default Music;
