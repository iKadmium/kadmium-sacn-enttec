import { useQuery } from "@apollo/client";
import React, { createContext, useContext } from "react";
import { Alert } from "shards-react";
import { DeviceQuery, IDeviceQuery } from "../graphql/DeviceQuery";

const DeviceContext = createContext<IDeviceQuery>({} as any);

export const useDeviceContext = () => useContext(DeviceContext);

export const DeviceProvider: React.FC = ({ children }) => {
	const { data, loading, error } = useQuery<IDeviceQuery>(DeviceQuery);

	if (loading || !data) {
		return <p>Loading</p>
	}
	if (error) {
		return <Alert>{error && error.message}</Alert>
	}
	return <DeviceContext.Provider value={data}>
		{children}
	</DeviceContext.Provider>
}