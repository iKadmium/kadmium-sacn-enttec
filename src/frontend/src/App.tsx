import React from 'react';
import styled from "styled-components";
import { DeviceList } from './components/DeviceList/DeviceList';
import { DeviceProvider } from './context/DeviceContext';
import { GraphQLProvider } from './context/GraphQLContext';


function App() {
	return (
		<GraphQLProvider>
			<Header>
				<h1>kadmium-sacn-enttec</h1>
			</Header>
			<DeviceProvider>
				<DeviceList />
			</DeviceProvider>
		</GraphQLProvider>
	);
}

export default App;

const Header = styled.header`
	margin: 2rem;
`;