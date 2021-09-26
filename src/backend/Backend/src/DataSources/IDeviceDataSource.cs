using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.src.GraphQL.Devices;

namespace backend.src.DataSources
{
	public interface IDeviceDataSource
	{
		Task<IEnumerable<DeviceSource>> GetDevicesAsync();
		Task<DeviceSource> ConnectAsync(string port, UInt16 universe);
		Task<DeviceSource> DisconnectAsync(string port);
	}
}