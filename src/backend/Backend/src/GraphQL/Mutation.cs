using backend.src.GraphQL.Devices;
using GraphQL;
using GraphQL.Types;

namespace backend.src.GraphQL
{
	public class Mutation : ObjectGraphType
	{
		public Mutation()
		{
			Field<DeviceMutationGraphType>()
				.Name("device")
				.Argument<NonNullGraphType<IdGraphType>>("id", "The port of the device")
				.Resolve(ctx =>
				{
					ctx.UserContext["port"] = ctx.GetArgument<string>("id");
					return new { };
				});

		}
	}
}