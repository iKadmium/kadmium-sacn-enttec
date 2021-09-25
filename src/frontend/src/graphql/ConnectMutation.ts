import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { IDevice } from "./DeviceQuery";

export interface IConnectMutation {
	device: {
		connect: IDevice;
	}
}

export interface IConnectMutationVars {
	id: string;
	universe: number;
}

const connectMutation = gql`
	mutation ConnectMutation($id: ID!, $universe: UShort!)
	{
		device(id: $id)
		{
			connect(universe: $universe)
			{
				id
				status
				universe
			}
		}
	}
`;

export const useConnectMutation = () => useMutation<IConnectMutation, IConnectMutationVars>(connectMutation);