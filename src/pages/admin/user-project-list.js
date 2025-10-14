import React from 'react';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| USER PROJECT LIST PAGE ||============================== //

const UserProjectList = () => {
    return (
        <MainCard title="Kullanıcı Proje Listesi">
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Kullanıcı Proje Listesi</h2>
                <p>Bu sayfa henüz geliştirilme aşamasındadır.</p>
                <p>Azure DevOps&apos;ta kullanıcıların hangi projelerde çalıştığını gösteren API hazırlandığında bu sayfa aktif hale gelecektir.</p>
            </div>
        </MainCard>
    );
};

export default UserProjectList;
