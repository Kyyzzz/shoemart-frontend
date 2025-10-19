import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/recent-activity'),
      ]);

      setStats(statsRes.data.data);
      setActivities(activityRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="text-green-600" size={20} />;
      case 'product':
        return <Package className="text-blue-600" size={20} />;
      case 'user':
        return <Users className="text-purple-600" size={20} />;
      default:
        return <Package className="text-gray-600" size={20} />;
    }
  };

  const getActivityBgColor = (type) => {
    switch (type) {
      case 'order':
        return 'bg-green-100';
      case 'product':
        return 'bg-blue-100';
      case 'user':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statsData = [
    {
      title: 'Total Products',
      value: stats?.products.total || 0,
      icon: Package,
      color: 'bg-blue-500',
      change: stats?.products.change || '0%',
    },
    {
      title: 'Total Orders',
      value: stats?.orders.total || 0,
      icon: ShoppingBag,
      color: 'bg-green-500',
      change: stats?.orders.change || '0%',
    },
    {
      title: 'Total Users',
      value: stats?.users.total || 0,
      icon: Users,
      color: 'bg-purple-500',
      change: stats?.users.change || '0%',
    },
    {
      title: 'Revenue',
      value: `$${(stats?.revenue.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: stats?.revenue.change || '0%',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your store overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => {
            const isPositive = stat.change.startsWith('+');
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="text-white" size={24} />
                  </div>
                  <div className="flex items-center gap-1">
                    {isPositive ? (
                      <TrendingUp className="text-green-600" size={16} />
                    ) : (
                      <TrendingDown className="text-red-600" size={16} />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/products"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <Package className="text-blue-600" size={24} />
              <div>
                <h3 className="font-semibold">Manage Products</h3>
                <p className="text-sm text-gray-600">Add, edit, or remove products</p>
              </div>
            </Link>

            <Link
              to="/admin/orders"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
            >
              <ShoppingBag className="text-green-600" size={24} />
              <div>
                <h3 className="font-semibold">View Orders</h3>
                <p className="text-sm text-gray-600">Track and manage orders</p>
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
            >
              <Users className="text-purple-600" size={24} />
              <div>
                <h3 className="font-semibold">Manage Users</h3>
                <p className="text-sm text-gray-600">View and manage users</p>
              </div>
            </Link>

            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
            >
              <Users className="text-purple-600" size={24} />
              <div>
                <h3 className="font-semibold">Refresh Data</h3>
                <p className="text-sm text-gray-600">Update dashboard stats</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between pb-4 border-b last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${getActivityBgColor(
                        activity.type
                      )} rounded-full flex items-center justify-center`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="font-semibold">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {getTimeAgo(activity.time)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;