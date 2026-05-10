type InfoItemProps = {
  title: string;
  value: string | number;
};

const InfoItem = ({ title, value }: InfoItemProps) => {
  return (
  <div className="flex flex-col">
      <span className="text-sm text-gray-300">{title}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
};

export default InfoItem;
