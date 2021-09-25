import React, { useCallback, useState } from "react";
import { Button, Card, CardBody, CardFooter, Form, FormGroup, FormInput, Modal, ModalBody, ModalFooter, ModalHeader } from "shards-react";
import styled from "styled-components";
import { IDevice } from "../../graphql/DeviceQuery";

export interface IEnttecDeviceProps {
	device: IDevice;
	onConnect: (universe: number) => Promise<boolean>;
	onDisconnect: () => Promise<boolean>;
}

const getStatusText = (device: IDevice) => {
	switch (device.status) {
		case "AVAILABLE": return "Available";
		case "IN_USE": return `Listening on Universe ${device.universe}`;
	}
}

export const EnttecDevice: React.FC<IEnttecDeviceProps> = ({ device, onConnect, onDisconnect }) => {
	const showFooter = device.status === "AVAILABLE" || device.status === "IN_USE";
	const [connectModalOpen, setConnectModalOpen] = useState<boolean>(false);
	const [disconnectModalOpen, setDisconnectModalOpen] = useState<boolean>(false);
	const [universeBox, setUniverseBox] = useState<HTMLInputElement | null>();
	const [universeValid, setUniverseValid] = useState<boolean | null>(null);
	const [isBusy, setIsBusy] = useState<boolean>(false);

	const universeCallback = useCallback<(node: HTMLInputElement) => void>(node => {
		if (node !== null) {
			setUniverseBox(node);
			node.focus();
		}
	}, []);

	const handleConnectClick = () => {
		setConnectModalOpen(true);
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const elements = event.currentTarget.elements;
		const universeItem = elements.namedItem("#universe");
		if (universeItem && "value" in universeItem) {
			const universe = Number(universeItem.value);
			try {
				setIsBusy(true);
				await onConnect(universe);
				setIsBusy(false);
				setConnectModalOpen(false);
			} catch (error) {
				setIsBusy(false);
			}
		}
	}

	const handleConnectCancelClick = () => {
		setConnectModalOpen(false);
	}

	const handleDisconnectClick = () => {
		setDisconnectModalOpen(true);
	}

	const handleDisconnectOKClick = async () => {
		try {
			setIsBusy(true);
			await onDisconnect();
			setIsBusy(false);
			setDisconnectModalOpen(false);
		} catch (error) {
			console.error(error);
			setIsBusy(false);
		}
	}

	const validateUniverse = (value: string | undefined) => {
		if (value) {
			const valueNumber = Number(value);
			if (valueNumber >= 1 && valueNumber <= 64000) {
				return true;
			}
			return false;
		}
		return null;
	}

	return (
		<>
			<Card>
				<CardBody>
					<table>
						<tbody>
							<tr>
								<th>Port</th>
								<Td>{device.id}</Td>
							</tr>
							<tr>
								<th>Status</th>
								<Td>{getStatusText(device)}</Td>
							</tr>
						</tbody>
					</table>
				</CardBody>
				{showFooter && <CardFooter>
					{device.status === "AVAILABLE" && <Button onClick={() => handleConnectClick()}>Connect</Button>}
					{device.status === "IN_USE" && <Button theme="danger" onClick={() => handleDisconnectClick()}>Disconnect</Button>}
				</CardFooter>}
			</Card>

			<Modal open={connectModalOpen} toggle={() => setConnectModalOpen(!connectModalOpen)}>
				<Form onSubmit={(event) => handleSubmit(event)}>
					<ModalHeader>Connect</ModalHeader>
					<ModalBody>

						<FormGroup>
							<label htmlFor="#universe">Universe</label>
							<FormInput
								id="#universe"
								placeholder="Universe"
								innerRef={universeCallback as any}
								onChange={() => setUniverseValid(validateUniverse(universeBox?.value))}
								valid={universeValid === true}
								invalid={universeValid === false}
							/>
						</FormGroup>
					</ModalBody>
					<ModalFooter>
						<Button type="submit" disabled={!universeValid || isBusy}>Connect</Button>
						<Button theme="secondary" onClick={() => handleConnectCancelClick()}>Cancel</Button>
					</ModalFooter>
				</Form>
			</Modal>

			<Modal open={disconnectModalOpen} toggle={() => setDisconnectModalOpen(!disconnectModalOpen)}>
				<ModalHeader>Disconnect</ModalHeader>
				<ModalBody>
					<p>Are you sure you want to disconnect the device at {device.id}?</p>
				</ModalBody>
				<ModalFooter>
					<Button theme="danger" disabled={isBusy} onClick={() => handleDisconnectOKClick()}>Disconnect</Button>
					<Button theme="secondary" onClick={() => handleConnectCancelClick()}>Cancel</Button>
				</ModalFooter>
			</Modal>
		</>
	);
}

const Td = styled.td`
	padding-left: 2rem;
`;