
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { toast, Toaster } from 'sonner';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StaffModel = () => {
  const { nodes, materials } = useGLTF('/models/staff-transformed.glb');
  
  return (
    <group rotation={[0, 0.005, 0]} scale={1.5}>
      <mesh
        geometry={nodes.Wizard_Staff3_Wizard_Staff3_0.geometry}
        material={materials.Wizard_Staff3}
      />
    </group>
  );
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function ElyassiDashboard() {
  const [data, setData] = useState({
    kpis: {
      tasksCompleted: 0,
      campaignsContributed: 0,
      turnaroundTime: 0,
      engagementScore: 0
    },
    contributions: {
      labels: [],
      datasets: []
    },
    members: []
  });

  useEffect(() => {
    // Mock data - replace with actual API/CSV fetch
    setData({
      kpis: {
        tasksCompleted: 189,
        campaignsContributed: 24,
        turnaroundTime: 3.2,
        engagementScore: 92
      },
      contributions: {
        labels: ['Alice', 'Bob', 'Charlie'],
        datasets: [
          {
            label: 'Twitter',
            data: [20, 15, 25],
            backgroundColor: 'rgba(138, 43, 226, 0.6)'
          },
          {
            label: 'LinkedIn',
            data: [15, 20, 10],
            backgroundColor: 'rgba(254, 254, 91, 0.6)'
          }
        ]
      },
      members: [
        { name: 'Alice', completion: 85, tasks: 45 },
        { name: 'Bob', completion: 92, tasks: 38 },
        { name: 'Charlie', completion: 78, tasks: 42 }
      ]
    });

    // AI recommendations check
    const checkWorkload = () => {
      data.members.forEach(member => {
        if (member.tasks > 40) {
          toast.warning(`High workload for ${member.name}`, {
            description: 'Consider task redistribution'
          });
        }
      });
    };

    checkWorkload();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-firefly-radial opacity-20" />
      
      <Toaster position="top-right" />
      
      <motion.h1 
        className="text-4xl font-bold text-accent mb-8"
        {...fadeIn}
      >
        Elyassi Team Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(data.kpis).map(([key, value], index) => (
          <motion.div
            key={key}
            className="shadow-glass p-6 rounded-lg backdrop-blur-sm"
            {...fadeIn}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="text-muted capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
            <p className="text-3xl font-bold text-accent">
              {key === 'turnaroundTime' ? `${value}h` : value}
              {key === 'engagementScore' ? '%' : ''}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="shadow-glass p-6 rounded-lg backdrop-blur-sm lg:col-span-2"
          {...fadeIn}
        >
          <h2 className="text-2xl font-bold text-accent mb-4">Campaign Contributions</h2>
          <Bar data={data.contributions} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                labels: { color: '#FFFFFF' }
              }
            },
            scales: {
              x: { stacked: true },
              y: { stacked: true }
            }
          }} />
        </motion.div>

        <motion.div
          className="shadow-glass p-6 rounded-lg backdrop-blur-sm"
          {...fadeIn}
        >
          <h2 className="text-2xl font-bold text-accent mb-4">Magic Staff</h2>
          <div className="h-64">
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <StaffModel />
            </Canvas>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="shadow-glass p-6 rounded-lg backdrop-blur-sm"
        {...fadeIn}
      >
        <h2 className="text-2xl font-bold text-accent mb-4">Team Progress</h2>
        <div className="space-y-4">
          {data.members.map((member, index) => (
            <div key={member.name} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted">{member.name}</span>
                <span className="text-accent">{member.completion}%</span>
              </div>
              <motion.div 
                className="h-2 bg-muted/20 rounded-full overflow-hidden"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <motion.div 
                  className="h-full bg-accent"
                  initial={{ width: '0%' }}
                  animate={{ width: `${member.completion}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
