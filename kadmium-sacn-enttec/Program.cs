using kadmium_sacn_core;
using System;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;

namespace kadmium_sacn_enttec
{
    class Program
    {
        private static int PORT = 5568;

        static async Task Main(string[] args)
        {
            UdpClient client = new UdpClient(PORT);
            IPAddress multicastAddress = new IPAddress(new byte[] { 239, 255, 0, 1 });
            client.JoinMulticastGroup(multicastAddress);
            IPEndPoint remoteIP = null;

            int packetsSinceLastUpdate = 0;

            if (args.Length == 0)
            {
                Console.WriteLine("Available ports are ");
                foreach(var portName in System.IO.Ports.SerialPort.GetPortNames())
                {
                    Console.WriteLine(" - " + portName);
                }
                return;
            }

            Timer timer = new Timer((state) =>
            {
                try
                {
                    Console.WriteLine("Packets per second = " + packetsSinceLastUpdate);
                    packetsSinceLastUpdate = 0;
                }
                catch (Exception e)
                {
                    Console.Error.WriteLine(e.Message);
                }
            }, null, new TimeSpan(0, 0, 1), new TimeSpan(0, 0, 1));

            EnttecWriter writer = new EnttecWriter(args[0]);

            var listenTask = Task.Run(async () =>
            {
                while (true)
                {
                    try
                    {
                        var result = await client.ReceiveAsync();
                        byte[] received = result.Buffer;
                        SACNPacket packet = SACNPacket.Parse(received);
                        await writer.WritePacket(packet.Data);
                        packetsSinceLastUpdate++;
                    }
                    catch (Exception e)
                    {
                        Console.Error.WriteLine(e.Message);
                    }
                }
            });

            await listenTask;
        }
    }
}
