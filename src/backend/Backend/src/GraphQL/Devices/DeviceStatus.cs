using GraphQL.Types;

namespace backend.src.GraphQL.Devices
{
	public enum DeviceStatus
	{
		Available,
		InUse
	}

	public class DeviceStatusGraphType : EnumerationGraphType<DeviceStatus>
	{
	}
}