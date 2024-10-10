// import React from 'react';
import StatisticsSection from './StatisticsSection'; // Assuming you already have this component

const AdminReports = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Admin Reports</h1>

        {/* Statistics Overview Section */}
        <StatisticsSection />
        </div>
    </div>
  );
};

export default AdminReports;
