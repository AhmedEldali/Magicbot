
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { toast, Toaster } from 'sonner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function MagicBotDashboard() {
  const [data, setData] = useState({
    kpis: {
      campaigns: 0,
      engagement: 0,
      revenue: 0,
      uptime: 0
    },
    trends: {
      labels: [],
      datasets: []
    },
    clients: []
  });

  useEffect(() => {
    // Fetch data from API or CSV
    // Mock data for demonstration
    setData({
      kpis: {
        campaigns: 156,
        engagement: 8.4,
        revenue: 52890,
        uptime: 99.9
      },
      trends: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Engagement Rate',
          data: [4.2, 5.1, 6.8, 7.2, 8.1, 8.4],
          borderColor: '#FEFE5B',
          backgroundColor: 'rgba(254, 254, 91, 0.2)'
        }]
      },
      clients: [
        { id: 1, name: 'Mystic Arts', platform: 'Instagram', posts: 45, engagement: 8.9, status: 'Active' },
        { id: 2, name: 'Enchanted', platform: 'Twitter', posts: 32, engagement: 7.6, status: 'Active' },
        { id: 3, name: 'Spellbound', platform: 'LinkedIn', posts: 28, engagement: 5.4, status: 'Warning' }
      ]
    });

    // Check for low engagement
    const checkEngagement = () => {
      data.clients.forEach(client => {
        if (client.engagement < 6) {
          toast.warning(`Low engagement for ${client.name}`, {
            description: `Current rate: ${client.engagement}%`
          });
        }
      });
    };

    checkEngagement();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6 relative">
      <img
        src="/images/forest-bg.jpg"
        alt="Forest Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10"
      />
      
      <Toaster position="top-right" />
      
      <motion.h1 
        className="text-4xl font-bold text-accent mb-8"
        {...fadeIn}
      >
        MagicBot Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(data.kpis).map(([key, value], index) => (
          <motion.div
            key={key}
            className="custom-bg p-6 rounded-lg"
            {...fadeIn}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="text-foreground/60 capitalize">{key}</h3>
            <p className="text-3xl font-bold text-accent">
              {key === 'revenue' ? `$${value.toLocaleString()}` : value}
              {key === 'engagement' || key === 'uptime' ? '%' : ''}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="custom-bg p-6 rounded-lg mb-8"
        {...fadeIn}
      >
        <h2 className="text-2xl font-bold text-accent mb-4">Engagement Trends</h2>
        <Line data={data.trends} options={{
          responsive: true,
          plugins: {
            legend: {
              labels: { color: '#FFFFFF' }
            }
          },
          scales: {
            y: { grid: { color: '#FFFFFF20' } },
            x: { grid: { color: '#FFFFFF20' } }
          }
        }} />
      </motion.div>

      <motion.div
        className="custom-bg p-6 rounded-lg"
        {...fadeIn}
      >
        <h2 className="text-2xl font-bold text-accent mb-4">Client Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-accent/30">
                <th className="p-3">Client</th>
                <th className="p-3">Platform</th>
                <th className="p-3">Posts</th>
                <th className="p-3">Engagement</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.clients.map(client => (
                <tr key={client.id} className="border-b border-accent/10">
                  <td className="p-3">{client.name}</td>
                  <td className="p-3">{client.platform}</td>
                  <td className="p-3">{client.posts}</td>
                  <td className="p-3">{client.engagement}%</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      client.status === 'Active' ? 'bg-accent/20 text-accent' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
