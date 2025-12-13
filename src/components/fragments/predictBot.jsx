// "use client"

// import React, { useState } from 'react';
// import { 
//   Activity, 
//   AlertTriangle, 
//   CheckCircle2, 
//   XCircle, 
//   MapPin, 
//   Calendar, 
//   FileText, 
//   Wrench, 
//   Upload
// } from 'lucide-react';
// import { 
//   LineChart, 
//   Line, 
//   AreaChart, 
//   Area, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer, 
//   ReferenceLine 
// } from 'recharts';

// // --- Mock Data ---
// const equipmentData = [
//   {
//     id: 1,
//     name: "MRI Scanner A",
//     type: "MRI • Radiology Wing",
//     status: "healthy",
//     healthScore: 92,
//     remainingLife: "2.3 years",
//     lastMaintenance: "15/07/2024",
//     location: "Radiology Wing A",
//     nextMaintenance: "15/09/2024"
//   },
//   {
//     id: 2,
//     name: "CT Scanner B",
//     type: "CT • Emergency Wing",
//     status: "warning",
//     healthScore: 78,
//     remainingLife: "1.8 years",
//     lastMaintenance: "20/06/2024",
//     location: "Emergency Wing",
//     nextMaintenance: "20/08/2024"
//   },
//   {
//     id: 3,
//     name: "Ventilator 001",
//     type: "Ventilator • ICU Room 12",
//     status: "critical",
//     healthScore: 45,
//     remainingLife: "0.3 years",
//     lastMaintenance: "10/05/2024",
//     location: "ICU Room 12",
//     nextMaintenance: "Urgent"
//   },
//   {
//     id: 4,
//     name: "X-Ray Unit C",
//     type: "X-Ray • Orthopedic Wing",
//     status: "healthy",
//     healthScore: 89,
//     remainingLife: "3.1 years",
//     lastMaintenance: "01/07/2024",
//     location: "Orthopedic Wing",
//     nextMaintenance: "01/10/2024"
//   },
//   {
//     id: 5,
//     name: "X-Ray Unit C",
//     type: "X-Ray • Orthopedic Wing",
//     status: "healthy",
//     healthScore: 89,
//     remainingLife: "3.1 years",
//     lastMaintenance: "01/07/2024",
//     location: "Orthopedic Wing",
//     nextMaintenance: "01/10/2024"
//   }
// ];

// const anomalyData = [
//   { date: 'Aug 1', value: 5 },
//   { date: 'Aug 5', value: 8 },
//   { date: 'Aug 10', value: 12 },
//   { date: 'Aug 15', value: 7 },
// ];

// const failureData = [
//   { date: 'Sep 1', prob: 15 },
//   { date: 'Oct 1', prob: 30 },
//   { date: 'Nov 1', prob: 55 },
//   { date: 'Dec 1', prob: 75 },
// ];

// // --- Sub-components (Shadcn-like UI) ---

// const Badge = ({ status, children }) => {
//   const styles = {
//     healthy: "bg-black text-white",
//     warning: "bg-gray-200 text-gray-800",
//     critical: "bg-red-500 text-white"
//   };
//   return (
//     <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
//       {children}
//     </span>
//   );
// };

// const ProgressBar = ({ value, status }) => {
//   const colors = {
//     healthy: "bg-black",
//     warning: "bg-yellow-500",
//     critical: "bg-red-500"
//   };
//   return (
//     <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
//       <div 
//         className={`${colors[status ]} h-2 rounded-full`} 
//         style={{ width: `${value}%` }}
//       ></div>
//     </div>
//   );
// };

// export default function PredictPage() {
//   const [selectedId, setSelectedId] = useState(1);
//   const [chartView, setChartView] = useState<'anomaly' | 'failure'>('anomaly');
//   const [inputType, setInputType] = useState<'anomaly' | 'failure' | 'document'>('anomaly');

//   const selectedDevice = equipmentData.find(d => d.id === selectedId) || equipmentData[0];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
//       <div className="grid grid-cols-12 gap-6">
        
//         {/* LEFT COLUMN: Equipment Fleet */}
//         <div className="col-span-12 lg:col-span-4 space-y-4">
//           <div className="flex items-center space-x-2 mb-4">
//             <Activity className="w-5 h-5" />
//             <h2 className="font-semibold text-lg">Equipment Fleet (4)</h2>
//           </div>

//           <div className="space-y-4">
//             {equipmentData.map((item) => (
//               <div 
//                 key={item.id}
//                 onClick={() => setSelectedId(item.id)}
//                 className={`p-4 rounded-xl border cursor-pointer transition-all ${
//                   selectedId === item.id 
//                     ? 'bg-gray-100 border-gray-400 shadow-sm' 
//                     : 'bg-white border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <div className="flex justify-between items-start mb-2">
//                   <div className="flex items-start space-x-3">
//                     {item.status === 'healthy' && <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />}
//                     {item.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1" />}
//                     {item.status === 'critical' && <XCircle className="w-5 h-5 text-red-500 mt-1" />}
//                     <div>
//                       <h3 className="font-bold text-sm">{item.name}</h3>
//                       <p className="text-xs text-gray-500">{item.type}</p>
//                     </div>
//                   </div>
//                   <Badge status={item.status}>{item.status}</Badge>
//                 </div>

//                 <div className="mt-4">
//                   <div className="flex justify-between text-xs mb-1">
//                     <span className="text-gray-500">Health Score</span>
//                     <span className={`font-bold ${
//                       item.status === 'critical' ? 'text-red-500' : 
//                       item.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
//                     }`}>{item.healthScore}%</span>
//                   </div>
//                   <ProgressBar value={item.healthScore} status={item.status} />
//                 </div>

//                 <div className="flex justify-between mt-4 text-xs text-gray-500 border-t pt-3">
//                   <div>
//                     <p>Remaining Life</p>
//                     <p className="font-medium text-gray-900">{item.remainingLife}</p>
//                   </div>
//                   <div className="text-right">
//                     <p>Last Maintenance</p>
//                     <p className="font-medium text-gray-900">{item.lastMaintenance}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT COLUMN: Detail & Charts & Inputs */}
//         <div className="col-span-12 lg:col-span-8 space-y-6">
          
//           {/* Main Card */}
//           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
//             {/* Header */}
//             <div className="flex justify-between items-start mb-6">
//               <div className="flex items-center space-x-3">
//                 <Activity className="w-6 h-6" />
//                 <div>
//                   <h1 className="text-xl font-bold">{selectedDevice.name}</h1>
//                   <p className="text-sm text-gray-500">MRI</p>
//                 </div>
//               </div>
//               <Badge status={selectedDevice.status}>{selectedDevice.status}</Badge>
//             </div>

//             {/* Info Grid */}
//             <div className="grid grid-cols-3 gap-4 mb-8">
//               <div>
//                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Location</p>
//                 <p className="font-medium">{selectedDevice.location}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Activity className="w-3 h-3"/> Health Score</p>
//                 <p className={`font-bold ${
//                       selectedDevice.status === 'critical' ? 'text-red-500' : 
//                       selectedDevice.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
//                     }`}>{selectedDevice.healthScore}%</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Next Maintenance</p>
//                 <p className="font-medium">{selectedDevice.nextMaintenance}</p>
//               </div>
//             </div>

//             {/* Chart Toggle */}
//             <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
//               <button 
//                 onClick={() => setChartView('anomaly')}
//                 className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${chartView === 'anomaly' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
//               >
//                 Anomaly Trends
//               </button>
//               <button 
//                 onClick={() => setChartView('failure')}
//                 className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${chartView === 'failure' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
//               >
//                 Failure Prediction
//               </button>
//             </div>

//             {/* Charts Area */}
//             <div className="h-64 w-full mb-6">
//               {chartView === 'anomaly' ? (
//                 <>
//                   <h3 className="font-semibold mb-1">Anomaly Detection Over Time</h3>
//                   <p className="text-xs text-gray-500 mb-4">Monitoring anomalies detected in the last 30 days. Threshold set at 20 anomalies per day.</p>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={anomalyData}>
//                       <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e5e7eb" />
//                       <XAxis dataKey="date" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
//                       <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} domain={[0, 25]} />
//                       <Tooltip />
//                       <ReferenceLine y={20} stroke="red" strokeDasharray="3 3" />
//                       <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{r: 4, fill: "white", stroke: "#3b82f6", strokeWidth: 2}} />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </>
//               ) : (
//                 <>
//                   <h3 className="font-semibold mb-1">Failure Probability Forecast</h3>
//                   <p className="text-xs text-gray-500 mb-4">AI-powered prediction model showing probability of equipment failure over the next 4 months.</p>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={failureData}>
//                       <defs>
//                         <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
//                           <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e5e7eb" />
//                       <XAxis dataKey="date" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
//                       <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} domain={[0, 100]} />
//                       <Tooltip />
//                       <Area type="monotone" dataKey="prob" stroke="#f59e0b" fillOpacity={1} fill="url(#colorProb)" />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Manual Input Section */}
//           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
//             <div className="flex items-center gap-2 mb-2">
//               <Wrench className="w-4 h-4" />
//               <h3 className="font-semibold">Manual Inpu</h3>
//             </div>
//             <p className="text-xs text-gray-500 mb-6">Maintenance and service actions for machine</p>

//             {/* Input Action Buttons */}
//             <div className="grid grid-cols-3 gap-4 mb-8">
//               <button 
//                 onClick={() => setInputType('anomaly')}
//                 className={`py-4 rounded-lg border text-sm font-medium flex flex-col items-center justify-center gap-2 transition-all ${
//                   inputType === 'anomaly' ? 'bg-black text-white border-black' : 'bg-white border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <Activity className="w-4 h-4" />
//                 Anomaly Detection
//               </button>
//               <button 
//                 onClick={() => setInputType('failure')}
//                 className={`py-4 rounded-lg border text-sm font-medium flex flex-col items-center justify-center gap-2 transition-all ${
//                   inputType === 'failure' ? 'bg-black text-white border-black' : 'bg-white border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <AlertTriangle className="w-4 h-4" />
//                 Failure Prediction
//               </button>
//               <button 
//                 onClick={() => setInputType('document')}
//                 className={`py-4 rounded-lg border text-sm font-medium flex flex-col items-center justify-center gap-2 transition-all ${
//                   inputType === 'document' ? 'bg-black text-white border-black' : 'bg-white border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <Wrench className="w-4 h-4" />
//                 Document Input
//               </button>
//             </div>

//             {/* Conditional Content */}
//             <div className="space-y-6">
              
//               {/* Scenario 1: Anomaly Detection Form (Complex Form) */}
//               {inputType === 'anomaly' && (
//                 <>
//                   <h4 className="font-medium text-sm">Device Information</h4>
//                   <div className="grid grid-cols-2 gap-4">
//                     <input type="text" placeholder="UID" className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none" />
//                     <input type="text" placeholder="Product ID" className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none" />
//                     <input type="text" placeholder="Type" className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none" />
//                     <input type="text" placeholder="Air Temperature" className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none" />
//                     <input type="text" placeholder="Process Temperature" className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none" />
//                     <input type="text" placeholder="Rotational Speed" className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none" />
//                     <input type="text" placeholder="Torque" className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none" />
//                     <input type="text" placeholder="Tool Wear" className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none" />
//                     <input type="text" placeholder="Machine Failure" className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none" />
//                     <input type="text" placeholder="Machine Failure" className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none" />
//                   </div>
//                   <button className="w-full py-3 bg-white border border-gray-900 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors">
//                     Submit
//                   </button>
//                 </>
//               )}

//               {/* Scenario 2: Failure Prediction (Recommendation) */}
//               {inputType === 'failure' && (
//                 <>
//                   <h4 className="font-medium text-sm">Recommendation System</h4>
//                   <p className="text-xs text-gray-500 mb-2">Date of the Incident</p>
//                   <textarea 
//                     className="w-full p-4 text-sm border rounded-xl focus:ring-2 focus:ring-gray-200 outline-none min-h-[120px] resize-none text-gray-600"
//                     placeholder="Ganti Mesin, Jual, Beli baru minta atasan!"
//                   />
//                   <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
//                     <span>325 characters remaining</span>
//                     <span className="cursor-pointer hover:text-gray-600">/</span>
//                   </div>
//                 </>
//               )}

//               {/* Scenario 3: Document Input */}
//               {inputType === 'document' && (
//                 <div className="space-y-4">
//                   <button className="w-full py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
//                     <FileText className="w-4 h-4" />
//                     Download Template Document
//                   </button>
                  
//                   <div>
//                     <p className="font-medium text-sm mb-2">Submit Document</p>
//                     <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:bg-gray-50">
//                       <div className="w-full h-8 bg-gray-100 rounded"></div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//             </div>
//           </div>

//         </div>
//       </div>
      
//       {/* Floating Chat Button (Cosmetic) */}
//       <div className="fixed bottom-6 right-6">
//         <button className="flex items-center gap-2 bg-white shadow-lg border p-2 pl-4 rounded-full">
//           <span className="text-xs font-bold">CHAT WITH AI</span>
//           <div className="bg-gray-100 p-2 rounded-full">
//              <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-yellow-400 font-bold">⚡</div>
//           </div>
//         </button>
//       </div>
//     </div>
//   );
// }