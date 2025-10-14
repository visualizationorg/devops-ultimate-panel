import React, { useState, useEffect } from 'react';
import { fetchAllProjects, fetchWorkItemsForProject, fetchWorkItemDetails } from 'services/AzureDevOpsService';
import { useWorkItems } from 'hooks/useAzureDevOps';
import DataContainer from 'components/DataContainer';
import ApexCharts from 'react-apexcharts';

const WorkItemsPieChart = () => {
    const { data: workItems, loading, error, refresh } = useWorkItems();

    // System.State durumuna göre gruplama
    const stateCounts = workItems?.reduce((acc, item) => {
        const state = item.fields['System.State'];
        // undefined olanları saymamaya dikkat et
        if (state) {
            acc[state] = (acc[state] || 0) + 1;
        }
        return acc;
    }, {});

    // ApexCharts için Pie Chart yapılandırması
    const chartOptions = {
        labels: Object.keys(stateCounts).filter(label => label),  // Boş veya undefined label'ları filtrele
        title: {
            text: 'Work Items by State',
            align: 'center',
            style: {
                fontSize: '20px'
            }
        },
        legend: {
            position: 'bottom'
        },
        tooltip: {
            y: {
                formatter: (val) => (val !== undefined && val !== null) ? val.toString() : ''  // undefined değerleri kontrol et
            }
        }
    };

    // Series verilerinin boş olup olmadığını kontrol et
    const chartSeries = Object.values(stateCounts).filter(val => val !== undefined && val !== null);
    // console.log("State Counts:", stateCounts);
    // console.log("Chart Series:", chartSeries);

    return (
        <DataContainer
            loading={loading}
            error={error}
            data={workItems}
            onRetry={refresh}
            loadingMessage="Work item'lar yükleniyor..."
            noDataMessage="Henüz work item bulunmuyor"
        >
            <ApexCharts
                options={chartOptions}
                series={chartSeries}
                type="pie"
                height={600}
                width={'100%'}
            />
        </DataContainer>
    );
};

export default WorkItemsPieChart;
