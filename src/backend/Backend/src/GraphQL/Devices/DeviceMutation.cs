using System;
using backend.src.DataSources;
using GraphQL;
using GraphQL.Types;

namespace backend.src.GraphQL.Devices
{
	public class DeviceMutationGraphType : ObjectGraphType
	{
		public DeviceMutationGraphType(IDeviceDataSource deviceDataSource)
		{
			Field<NonNullGraphType<DeviceGraphType>>()
				.Name("connect")
				.Argument<NonNullGraphType<UShortGraphType>>("universe")
				.ResolveAsync(async ctx =>
				{
					string port = (string)ctx.UserContext["port"];
					var universe = ctx.GetArgument<UInt16>("universe");
					return await deviceDataSource.ConnectAsync(port, universe);
				});

			Field<NonNullGraphType<DeviceGraphType>>()
				.Name("disconnect")
				.ResolveAsync(async ctx =>
				{
					string port = (string)ctx.UserContext["port"];
					return await deviceDataSource.DisconnectAsync(port);
				});
		}
	}
}