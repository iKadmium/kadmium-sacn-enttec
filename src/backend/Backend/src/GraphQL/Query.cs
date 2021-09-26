using System;
using backend.src.DataSources;
using backend.src.GraphQL.Devices;
using GraphQL.Types;

namespace backend.src.GraphQL
{
	public class Query : ObjectGraphType
	{
		public Query(IDeviceDataSource deviceDataSource)
		{
			Name = "Query";

			Field<NonNullGraphType<ListGraphType<NonNullGraphType<DeviceGraphType>>>>()
				.Name("allDevices")
				.ResolveAsync(async ctx => await deviceDataSource.GetDevicesAsync());
		}
	}
}