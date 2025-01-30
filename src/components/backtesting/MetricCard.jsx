const MetricCard = ({ title, value }) => (
  <div className="p-4 bg-gray-700 rounded-lg">
    <h4 className="text-sm text-gray-400 mb-1">{title}</h4>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

export default MetricCard;