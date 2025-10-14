import React from 'react';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| PROJECT USER LIST PAGE ||============================== //

const ProjectUserList = () => {
    return (
        <MainCard title="Proje Kullanıcı Listesi">
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Proje Kullanıcı Listesi</h2>
                <p>Bu sayfa henüz geliştirilme aşamasındadır.</p>
                <p>Azure DevOps&apos;ta bir projedeki tüm kullanıcıları çeken API hazırlandığında bu sayfa aktif hale gelecektir.</p>
            </div>
        </MainCard>
    );
};

export default ProjectUserList;
