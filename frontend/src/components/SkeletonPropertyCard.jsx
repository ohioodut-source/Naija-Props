import React from 'react';

const SkeletonPropertyCard = () => {
    return (
        <div className="card glass">
            <div className="skeleton" style={{ height: '200px', width: '100%' }}></div>
            <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div className="skeleton" style={{ height: '24px', width: '70%' }}></div>
                    <div className="skeleton" style={{ height: '20px', width: '20%' }}></div>
                </div>
                <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '1rem' }}></div>
                <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: '0.5rem' }}></div>
                <div className="skeleton" style={{ height: '16px', width: '80%', marginBottom: '1.5rem' }}></div>
                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.1)', paddingTop: '1rem' }}>
                    <div className="skeleton" style={{ height: '20px', width: '30%' }}></div>
                    <div className="skeleton" style={{ height: '20px', width: '30%' }}></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonPropertyCard;
