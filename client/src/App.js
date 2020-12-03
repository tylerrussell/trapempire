import React, { useState, useContext, useEffect } from 'react';
import Constants from './Constants';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {
	HashRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { SpotifyContext, SpotifyProvider } from './context/Spotify';
import Sidebar from './components/Sidebar';
import SubMenu from './components/SubMenu';
import { AnimatePresence } from 'framer-motion';
import Music from './pages/Music';
import {
	Track,
	Artist,
	Playlist,
	SpotifyPlayer,
	Album,
} from './components/SpotifyComponents';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Search from './pages/Search';
import Radio from './pages/Radio';
const Global = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${Constants.colors.light};
    font-family: 'Open Sans', sans-serif;
  }
  a {
	text-decoration: none;
	color: ${Constants.colors.red};
  }
  .navbar > a {
    text-decoration: none;
  }
  header a {
    color: ${Constants.colors.red};
  }
  .subMenu a {
    &:hover{
      border-bottom: 1px dotted;
      margin-bottom: -1px;
    }
  }
  footer a {
    color: ${Constants.colors.yellow};
    &:hover{
      border-bottom: 1px dotted;
      margin-bottom: -1px;
    }
  }
  .sidebarItem {
    height: 70px;
    background-color: ${Constants.colors.dark1};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    margin: 5px;
  }
  .MuiGrid-item{
	min-width: 320px !important;
	max-width: 320px !important;
  }
  .MuiGrid-root{
    align-items: start !important;
  }
  .popup-content{
	  border-radius: 8px;
  }
`;
const MainContainer = styled.div`
	width: calc(100% - 80px);
	max-width: calc(100% - 80px);
	left: 80px;
	position: absolute;
	left: 80px;
	top: 0px;
`;
const HolyGrail = styled.div`
	display: flex;
	flex: 1;
	min-height: 100vh;
	flex-direction: column;
`;
const HolyGrailBody = styled.div`
	padding: 10px;
	display: flex;
	flex: 1;
`;
const FlexContainerRow = styled.div`
	display: flex;
	flex-direction: row;
	width: 100vw;
	height: 100vh;
	max-width: 100%; /* added */
`;
const PumpButtonElem = styled.button`
	display: flex;
	flex-direction: row;
	height: 30px;
	background-color: white;
	justify-content: center;
	align-items: center;
	width: 100%;
	border: 0;
	outline: none;
	cursor: pointer;
	&:hover {
		color: white;
		background-color: ${Constants.colors.red};
	}
`;
const PumpButton = () => {
	const { selectedTrack, credentials, userid } = useContext(SpotifyContext);
	const pump = () => {
		Axios.post('/spotify/pump', { uri: selectedTrack, username: userid })
			.then((res) => {
				// console.log({ res });
				toast('Thank you for the feedback!');
			})
			.catch((e) => toast.error(e.message));
	};
	return (
		selectedTrack &&
		credentials.loggedIn && (
			<PumpButtonElem onClick={pump}>
				Pump this track (Bangers Only)
			</PumpButtonElem>
		)
	);
};

function App() {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [navbarHeight, setNavbarHeight] = useState(72);
	useEffect(() => {
		let fn = () => {
			const height = document.getElementById('navbar').clientHeight;
			setNavbarHeight(height);
		};

		setInterval(fn, 1000);
		return () => {
			clearInterval(fn);
		};
	}, []);
	return (
		<AnimatePresence exitBeforeEnter initial={false}>
			<Router>
				<Global />
				<ToastContainer />
				<SpotifyProvider>
					<SpotifyContext.Consumer>
						{({ playlists }) => (
							<FlexContainerRow>
								<Sidebar />
								<MainContainer>
									<HolyGrail>
										<header>
											<Navbar
												sidebarOpen={sidebarOpen}
												setSidebarOpen={setSidebarOpen}
											/>
											<div style={{ height: navbarHeight }}></div>
											<SubMenu />
											<SpotifyPlayer />
											<PumpButton />
										</header>
										<HolyGrailBody>
											<Switch>
												<Route path='/' exact>
													<Home />
												</Route>
												<Route path='/login'>
													<Login />
												</Route>
												<Route path='/music'>
													<Music />
												</Route>
												<Redirect
													from='/trap'
													to={`/playlist/${playlists[playlists.length - 1]}`}
												/>
												<Route path='/track/:id'>
													<Track />
												</Route>
												<Route path='/album/:id'>
													<Album />
												</Route>
												<Route path='/artist/:id'>
													<Artist />
												</Route>
												<Route path='/playlist/:id'>
													<Playlist />
												</Route>
												<Route path='/search'>
													<Search />
												</Route>
												<Route path='/radio'>
													<Radio />
												</Route>
											</Switch>
										</HolyGrailBody>
										<footer>
											<Footer />
										</footer>
									</HolyGrail>
								</MainContainer>
							</FlexContainerRow>
						)}
					</SpotifyContext.Consumer>
				</SpotifyProvider>
			</Router>
		</AnimatePresence>
	);
}

export default App;
