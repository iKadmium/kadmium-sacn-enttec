import { gql } from "@apollo/client";

export const DeviceQuery = gql`
	query GetDevices
	{
		allDevices
		{
			id
			status
			universe
		}
	}
`;

interface IDeviceBase {
	id: string;
}

interface IDeviceInUse extends IDeviceBase {
	status: "IN_USE";
	universe: Number;
}

interface IDeviceAvailable extends IDeviceBase {
	status: "AVAILABLE";
	universe: null;
}

export type DeviceStatus = "AVAILABLE" | "IN_USE";

export type IDevice = IDeviceInUse | IDeviceAvailable;

export interface IDeviceQuery {
	allDevices: IDevice[];
}