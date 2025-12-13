export const equipmentData = [
  {
    id: 1,
    name: "MRI Scanner A",
    type: "MRI • Radiology Wing",
    status: "healthy",
    healthScore: 92,
    remainingLife: "2.3 years",
    lastMaintenance: "15/07/2024",
    location: "Radiology Wing A",
    nextMaintenance: "15/09/2024",
  },
  // ... data lainnya (sama seperti sebelumnya) ...
  {
    id: 2,
    name: "CT Scanner B",
    type: "CT • Emergency Wing",
    status: "warning",
    healthScore: 78,
    remainingLife: "1.8 years",
    lastMaintenance: "20/06/2024",
    location: "Emergency Wing",
    nextMaintenance: "20/08/2024",
  },
  {
    id: 3,
    name: "Ventilator 001",
    type: "Ventilator • ICU Room 12",
    status: "critical",
    healthScore: 45,
    remainingLife: "0.3 years",
    lastMaintenance: "10/05/2024",
    location: "ICU Room 12",
    nextMaintenance: "Urgent",
  },
  {
    id: 4,
    name: "X-Ray Unit C",
    type: "X-Ray • Orthopedic Wing",
    status: "healthy",
    healthScore: 89,
    remainingLife: "3.1 years",
    lastMaintenance: "01/07/2024",
    location: "Orthopedic Wing",
    nextMaintenance: "01/10/2024",
  },
];

export const anomalyData = [
  { date: "Aug 1", value: 5 },
  { date: "Aug 5", value: 8 },
  { date: "Aug 10", value: 12 },
  { date: "Aug 15", value: 7 },
];

export const failureData = [
  { date: "Sep 1", prob: 15 },
  { date: "Oct 1", prob: 30 },
  { date: "Nov 1", prob: 55 },
  { date: "Dec 1", prob: 75 },
];
