export default async function handler(req, res) {
  const data = [
    { time: '10:00', price: 0.88 },
    { time: '11:00', price: 0.91 },
    { time: '12:00', price: 0.93 },
    { time: '13:00', price: 0.89 },
    { time: '14:00', price: 0.92 },
  ];
  res.status(200).json(data);
}
