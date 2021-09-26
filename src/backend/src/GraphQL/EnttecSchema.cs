using System;
using GraphQL.Types;

namespace backend.src.GraphQL
{
	public class EnttecSchema : Schema
	{
		public EnttecSchema(IServiceProvider serviceProvider) : base(serviceProvider)
		{
			Query = (Query)serviceProvider.GetService(typeof(Query));
			Mutation = (Mutation)serviceProvider.GetService(typeof(Mutation));
		}
	}
}