import { render } from "@testing-library/react";
import React from "react";
import { DeviceProvider } from "../DeviceContext";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { DeviceQuery, IDeviceQuery } from "../../graphql/DeviceQuery";
import { Source } from "graphql";
import { act } from "react-dom/test-utils";

jest.mock('shards-react', () => ({
	__esModule: true,
	Alert: 'alert-mock'
}));

const successfulMock: MockedResponse<IDeviceQuery> = {
	request: {
		query: DeviceQuery
	},
	result: {
		data: {
			allDevices: [
				{
					id: "/dev/ttys0",
					status: "AVAILABLE",
					universe: null
				}
			]
		}
	}

};

const failedMock: MockedResponse<IDeviceQuery> = {
	request: {
		query: DeviceQuery
	},
	result: {
		errors: [
			{
				name: "My error",
				source: new Source("Somewhere"),
				nodes: [],
				extensions: [],
				locations: [],
				message: "Error message",
				originalError: undefined,
				path: undefined,
				positions: []
			}
		]
	}
}

test('Given it is loading, When DeviceContext is rendered, then it shows loading text', () => {
	const { getByText } = render(
		<MockedProvider mocks={[successfulMock]}>
			<DeviceProvider>
				<p>Stuff</p>
			</DeviceProvider>
		</MockedProvider>
	);

	expect(getByText(/Loading/)).toBeTruthy();
});

test('Given it has loaded, When DeviceContext is rendered, then it renders the children', async () => {
	const { getByText } = render(
		<MockedProvider mocks={[successfulMock]}>
			<DeviceProvider>
				<p>Stuff</p>
			</DeviceProvider>
		</MockedProvider>
	);

	await act(async () => await new Promise(resolve => setTimeout(resolve, 0)));

	expect(getByText(/Stuff/)).toBeTruthy();
});

test('Given it has errored, When DeviceContext is rendered, then it renders an alert with the error', async () => {
	const { getByText } = render(
		<MockedProvider mocks={[failedMock]}>
			<DeviceProvider>
				<p>Stuff</p>
			</DeviceProvider>
		</MockedProvider>
	);

	await act(async () => await new Promise(resolve => setTimeout(resolve, 0)));

	expect(getByText(/Error message/)).toBeTruthy();
});