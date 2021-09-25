using System;
using GraphQL.Types;

namespace backend.src.GraphQL.Devices
{
	public class DeviceSource
	{
		public string Id { get; set; }
		public DeviceStatus Status { get; set; }
		public UInt16? Universe { get; set; }
	}

	public class DeviceGraphType : ObjectGraphType<DeviceSource>
	{
		public DeviceGraphType()
		{
			Field(x => x.Id);
			Field(x => x.Status);
			Field<UShortGraphType>()
				.Name("universe")
				.Resolve(ctx => ctx.Source.Universe);
		}
	}
}