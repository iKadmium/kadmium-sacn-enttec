using System.Threading.Tasks;
using Kadmium_Enttec;

namespace backend.src.DataSources
{
	public class EnttecWriterFactory : IDmxWriterFactory
	{
		public async Task<IEnttecWriter> CreateDmxWriterAsync(string port)
		{
			var writer = new EnttecWriter();
			await writer.OpenAsync(port);
			return writer;
		}
	}
}