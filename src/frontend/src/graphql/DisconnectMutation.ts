import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { IDevice } from "./DeviceQuery";

export interface IDisonnectMutation {
	device: {
		disconnect: IDevice;
	}
}

export interface IDisconnectMutationVars {
	id: string;
}

const disconnectMutation = gql`
	mutation DisconnectMutation($id: ID!)
	{
		device(id: $id)
		{
			disconnect
			{
				id
				status
				universe
			}
		}
	}
`;

export const useDisconnectMutation = () => useMutation<IDisonnectMutation, IDisconnectMutationVars>(disconnectMutation);