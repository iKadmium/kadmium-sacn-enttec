using System.Collections.Generic;
using System.Threading.Tasks;
using backend.src.GraphQL.Devices;
using System.IO.Ports;
using System;
using System.Linq;
using GraphQL;
using Kadmium_sACN.SacnReceiver;
using System.Net;
using Kadmium_Enttec;

namespace backend.src.DataSources
{
	public class DeviceDataSource : IDeviceDataSource
	{
		private class WriterEntry
		{
			public UInt16 UniverseID { get; set; }
			public IEnttecWriter Writer { get; set; }
		}

		private IDmxWriterFactory WriterFactory { get; }
		private Dictionary<string, WriterEntry> Writers { get; }
		private IMulticastSacnReceiver SacnReceiver { get; }

		public DeviceDataSource(IDmxWriterFactory dmxWriterFactory, IMulticastSacnReceiver receiver)
		{
			WriterFactory = dmxWriterFactory;
			Writers = new Dictionary<string, WriterEntry>();
			SacnReceiver = receiver;

			receiver.Listen(IPAddress.Any);
			receiver.OnDataPacketReceived += (sender, packet) =>
			{
				var universe = packet.FramingLayer.Universe;
				var data = packet.DMPLayer.PropertyValues;
				var listeners = Writers.Values.Where(x => x.UniverseID == universe);
				foreach (var listener in listeners)
				{
					listener.Writer.WriteAsync(data.ToArray());
				}
			};
		}

		public async Task<DeviceSource> ConnectAsync(string port, UInt16 universe)
		{
			try
			{
				var writer = await WriterFactory.CreateDmxWriterAsync(port);
				if (!Writers.Values.Any(x => x.UniverseID == universe))
				{
					// start listening on a new universe
					SacnReceiver.JoinMulticastGroup(universe);
				}
				Writers.Add(port, new WriterEntry { Writer = writer, UniverseID = universe });
			}
			catch (Exception ex)
			{
				await Console.Error.WriteAsync(ex.ToString());
				throw new ExecutionError(ex.Message);
			}
			return new DeviceSource
			{
				Id = port,
				Status = DeviceStatus.InUse,
				Universe = universe
			};
		}

		public Task<IEnumerable<DeviceSource>> GetDevicesAsync()
		{
			return Task.Run(() =>
			{
				var names = SerialPort.GetPortNames();
				var sources = names.Select(name => new DeviceSource
				{
					Id = name,
					Status = Writers.ContainsKey(name) ? DeviceStatus.InUse : DeviceStatus.Available,
					Universe = Writers.ContainsKey(name) ? Writers[name].UniverseID : null
				});

				return sources;
			});
		}

		public async Task<DeviceSource> DisconnectAsync(string port)
		{
			var writer = Writers[port];
			try
			{
				await writer.Writer.DisposeAsync();
			}
			catch (Exception ex)
			{
				throw new ExecutionError(ex.Message);
			}

			var universeId = writer.UniverseID;
			Writers.Remove(port);
			if (!Writers.Values.Any(x => x.UniverseID == universeId))
			{
				// nobody needs anything from this universe anymore, so stop listening
				SacnReceiver.DropMulticastGroup(universeId);
			}

			return new DeviceSource
			{
				Id = port,
				Status = DeviceStatus.Available
			};
		}
	}
}