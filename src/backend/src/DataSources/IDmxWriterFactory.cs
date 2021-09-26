using System.Collections.Generic;
using System.Threading.Tasks;
using Kadmium_Enttec;

namespace backend.src.DataSources
{
	public interface IDmxWriterFactory
	{
		Task<IEnttecWriter> CreateDmxWriterAsync(string port);
	}
}