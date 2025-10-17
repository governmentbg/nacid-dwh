using System.Xml;
using System.Xml.Schema;
using System.Xml.Serialization;

namespace Infrastructure.FileManagementPackages.Xml
{
    [Serializable]
    public class DynamicXmlSerialize : IXmlSerializable
    {
        public List<dynamic> Result { get; set; } = new List<dynamic>();

        public XmlSchema GetSchema()
        {
            return new XmlSchema();
        }

        public void ReadXml(XmlReader reader)
        {
        }

        public void WriteXml(XmlWriter writer)
        {
            foreach (var item in Result)
            {
                writer.WriteStartElement("Result");
                var fields = item as IDictionary<string, object>;

                foreach (var prop in fields)
                {
                    if (prop.Key != "RowCount")
                    {
                        writer.WriteElementString(prop.Key, prop.Value?.ToString());
                    }
                }

                writer.WriteEndElement();
            }
        }
    }
}
