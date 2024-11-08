import React, { useEffect, useState } from "react";
import ApexChart from "react-apexcharts"; // Assuming you are using ApexCharts
import { LoadingOutlined } from '@ant-design/icons'; // for a loading indicator

const SelfHostedAgentsPieChart = () => {
  const [data, setData] = useState({ running: 0, stopped: 0 });
  const [loading, setLoading] = useState(true);

  const fetchPoolsAndAgents = async () => {
    const pat = process.env.REACT_APP_API_PAT;
    const token = btoa(`:${pat}`);
    const organization = 'nadidurna1';

    const headers = {
      "Authorization": `Basic ${token}`,
      "Content-Type": "application/json"
    };

    try {
      // Fetch all pools
      const poolsResponse = await fetch(`https://dev.azure.com/${organization}/_apis/distributedtask/pools?api-version=7.2-preview.1`, { headers });
      const poolsData = await poolsResponse.json();

      let running = 0;
      let stopped = 0;

      // For each pool, fetch the agents and filter based on the conditions
      const poolPromises = poolsData.value.map(async (pool) => {
        if (pool.isHosted === false && pool.poolType === "automation") {
          const agentsResponse = await fetch(`https://dev.azure.com/${organization}/_apis/distributedtask/pools/${pool.id}/agents?api-version=7.0`, { headers });
          const agentsData = await agentsResponse.json();

          agentsData.value.forEach(agent => {
            if (agent.enabled === true && agent.status === "online") {
              running++;
            } else {
              stopped++;
            }
          });
        }
      });

      await Promise.all(poolPromises);
      setData({ running, stopped });
      setLoading(false);

    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchPoolsAndAgents();
  }, []);

  // Chart configuration
  const chartOptions = {
    chart: {
      type: 'pie',
    },
    labels: ['Available', 'Unavailable'],
  };

  return (
    <div>
      {loading ? <LoadingOutlined style={{ fontSize: 24 }} spin /> : (
        <ApexChart
          options={chartOptions}
          series={[data.running, data.stopped]}
          type="pie"
          width="500"
        />
      )}
    </div>
  );
};

export default SelfHostedAgentsPieChart;
