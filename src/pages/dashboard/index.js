import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Grid
} from '@mui/material';

// project import
import AnalyticsDataCard from 'components/cards/statistics/AnalyticsDataCard';
import WelcomeBanner from 'sections/dashboard/WelcomeBanner';
import UsersCardChart from 'sections/dashboard/UsersCardChart';
import LastBuildsChart from 'sections/dashboard/LastBuildsChart';

import { GetAll as GetAllProjects } from 'api/ProjectsApi';
import { GetAll as GetAllUserEntitlements } from 'api/UserEntitlementsApi';

// third-party
import { FormattedMessage } from 'react-intl';
import AzureDevOpsBuilds from 'sections/dashboard/last20builds';
import AzureDevOpsWorkItemsPieChart from 'sections/dashboard/WorkItemsPieChart';
import AzureDevOpsWorkItems from 'sections/admin/workitems-list/Workitems';
import SelfHostedAgentsPieChart from 'sections/dashboard/SelfHostedAgentsPieChart';
import DeploymentPoolsPieChart from 'sections/dashboard/DeploymentPoolsPieChart';

// ==============================|| DASHBOARD ||============================== //

const Dashboard = () => {

    const [projectCount, setProjectCount] = useState([]);
    const [userCount, setUserCount] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsResponse = await GetAllProjects();
                setProjectCount(projectsResponse.data.count);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const usersResponse = await GetAllUserEntitlements();
                setUserCount(usersResponse.data.totalCount);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchProjects();
        fetchUsers();
    }, []);

    return (
        <>
            <Grid container rowSpacing={4.5} columnSpacing={3}>
                {/* row 1 */}
                <Grid item xs={12}>
                    <WelcomeBanner />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <AnalyticsDataCard title="XAML Build History" count={new Date().toLocaleDateString()}>
                        <UsersCardChart />
                    </AnalyticsDataCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <AnalyticsDataCard title="Total Projects" count={projectCount.toString()}>
                        {/* <OrdersCardChart />  */}
                    </AnalyticsDataCard>
                    <AnalyticsDataCard title="Total Users" count={userCount.toString()}>
                        {/*<SalesCardChart /> */}
                    </AnalyticsDataCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <AnalyticsDataCard title="Self Hosted Agents">
                        <SelfHostedAgentsPieChart />
                    </AnalyticsDataCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <AnalyticsDataCard title="Deployment Pools">
                        <DeploymentPoolsPieChart />
                    </AnalyticsDataCard>
                </Grid>
                <Grid item xs={12}>
                    <LastBuildsChart />
                </Grid>
                <Grid item xs={12}>
                    <AzureDevOpsBuilds />
                </Grid>
                <Grid item xs={12}>
                    <AzureDevOpsWorkItems />
                </Grid>
                <Grid item xs={12}>
                    <AzureDevOpsWorkItemsPieChart />
                </Grid>

                {/* <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} /> */}

            </Grid>

        </>
    )
};

export default Dashboard;
