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

export interface IDevice {
	id: string;
	status: DeviceStatus;
	universe?: Number;
}

export type DeviceStatus = "AVAILABLE" | "IN_USE";

export interface IDeviceQuery {
	allDevices: IDevice[];
}