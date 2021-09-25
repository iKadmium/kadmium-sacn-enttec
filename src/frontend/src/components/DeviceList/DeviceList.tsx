import { FetchResult } from "@apollo/client";
import React, { useState } from "react";
import { Alert, Theme } from "shards-react";
import styled from "styled-components";
import { useDeviceContext } from "../../context/DeviceContext";
import { useConnectMutation } from "../../graphql/ConnectMutation";
import { IDevice } from "../../graphql/DeviceQuery";
import { useDisconnectMutation } from "../../graphql/DisconnectMutation";
import { EnttecDevice } from "../EnttecDevice/EnttecDevice";

interface IAlert {
	theme: Theme;
	message: JSX.Element;
}

export const DeviceList: React.FC = () => {
	const { allDevices } = useDeviceContext();

	const [connect] = useConnectMutation();
	const [disconnect] = useDisconnectMutation();
	const [messages, setMessages] = useState<IAlert[]>([]);

	const handleAction = async <TData,>(action: () => Promise<FetchResult<TData>>) => {
		try {
			const result = await action();
			if (result.data) {
				return true;
			} else if (result.errors) {
				for (const error of result.errors) {
					addMessage({ theme: "danger", message: <pre>{error.message}</pre> });
				}
			}
			return false;
		}
		catch (error) {
			addMessage({ theme: "danger", message: <pre>{(error as Error)?.message}</pre> });
			return false;
		}
	}

	const handleConnect = async (device: IDevice, universe: number) => {
		return await handleAction(() => connect({ variables: { id: device.id, universe: universe } }));
	}

	const handleDisconnect = async (device: IDevice) => {
		return await handleAction(() => disconnect({ variables: { id: device.id } }));
	}

	const addMessage = (message: IAlert) => {
		const newMessages = [...messages];
		newMessages.push(message);
		setMessages(newMessages);
	}

	return (
		<Article>
			{messages.map(message => <Alert theme={message.theme}>{message.message}</Alert>)}
			<h2>Serial Port Devices</h2>
			<ListWrapper>
				{allDevices.map(device => <EnttecDevice
					device={device}
					key={device.id}
					onConnect={(universe) => handleConnect(device, universe)}
					onDisconnect={() => handleDisconnect(device)}
				/>)}
			</ListWrapper>
		</Article>
	)
}

const Article = styled.article`
  	margin: 2rem;
`;

const ListWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2rem;

	@media (min-width: 481px) {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	}
`;