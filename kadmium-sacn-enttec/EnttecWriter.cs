using RJCP.IO.Ports;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace kadmium_sacn_enttec
{
    class EnttecWriter : IDisposable
    {
        private static int DMX_PRO_MIN_DATA_SIZE = 25;
        private static byte DMX_PRO_MESSAGE_START = 0x7E;
        private static byte DMX_PRO_MESSAGE_END = 0xE7;
        private static byte DMX_PRO_SEND_PACKET = 6;
        
        private byte[] Metadata { get; set; }
        private byte[] EndData { get; set; }

        SerialPortStream Port { get; set; }

        public EnttecWriter(string portName)
        {
            Port = new SerialPortStream(portName, 115200, 8, Parity.None, StopBits.One);
            Port.Open();
            Metadata = new byte[5];

            Metadata[0] = DMX_PRO_MESSAGE_START;
            Metadata[1] = DMX_PRO_SEND_PACKET;
            Metadata[4] = 0; // DMX Command byte

            EndData = new byte[1] { DMX_PRO_MESSAGE_END };
        }

        public async Task WritePacket(byte[] data)
        {
            Metadata[2] = (byte)(data.Length & 255);
            Metadata[3] = (byte)((data.Length >> 8) & 255);

            await Port.WriteAsync(Metadata, 0, Metadata.Length);
            await Port.WriteAsync(data, 0, data.Length);
            await Port.WriteAsync(EndData, 0, EndData.Length);

        }

        public void Dispose()
        {
            Port.Close();
            Port.Dispose();
        }
    }
}
