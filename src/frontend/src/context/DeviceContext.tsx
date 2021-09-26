import { useQuery } from "@apollo/client";
import React, { createContext, useContext } from "react";
import { Alert } from "shards-react";
import { DeviceQuery, IDeviceQuery } from "../graphql/DeviceQuery";

const DeviceContext = createContext<IDeviceQuery>({} as any);

export const useDeviceContext = () => useContext(DeviceContext);

export const DeviceProvider: React.FC = ({ children }) => {
	const { data, loading, error } = useQuery<IDeviceQuery>(DeviceQuery);

	if (error) {
		return <Alert theme="danger">{error && error.message}</Alert>
	}
	if (loading || !data) {
		return <p>Loading</p>
	}

	return <DeviceContext.Provider value={data}>
		{children}
	</DeviceContext.Provider>
}