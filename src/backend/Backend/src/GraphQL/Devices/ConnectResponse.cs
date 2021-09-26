using GraphQL.Types;

namespace backend.src.GraphQL.Devices
{
	public class ConnectResponseSource
	{
		public bool Success { get; set; }
		public string ErrorMessage { get; set; }
	}

	public class ConnectResponseGraphType : ObjectGraphType<ConnectResponseSource>
	{
		public ConnectResponseGraphType()
		{
			Field(x => x.Success);
			Field<StringGraphType>()
				.Name("errorMessage")
				.Resolve(ctx => ctx.Source.ErrorMessage);
		}
	}
}