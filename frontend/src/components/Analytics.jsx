import { useState } from 'react'

const Analytics = ({ onClose }) => {
  const [timeRange, setTimeRange] = useState('month')

  const stats = {
    totalCrops: 12,
    totalQuantity: '2.4 tons',
    successRate: 95,
    lossRate: 5,
    avgStorageDays: 45,
    alertsResolved: 28
  }

  const cropData = [
    { name: 'Rice', quantity: 800, percentage: 33, color: 'bg-lime-500' },
    { name: 'Wheat', quantity: 600, percentage: 25, color: 'bg-green-500' },
    { name: 'Potato', quantity: 500, percentage: 21, color: 'bg-yellow-500' },
    { name: 'Vegetables', quantity: 300, percentage: 13, color: 'bg-orange-500' },
    { name: 'Others', quantity: 200, percentage: 8, color: 'bg-blue-500' }
  ]

  const monthlyData = [
    { month: 'Jan', saved: 85, lost: 15 },
    { month: 'Feb', saved: 88, lost: 12 },
    { month: 'Mar', saved: 92, lost: 8 },
    { month: 'Apr', saved: 95, lost: 5 },
    { month: 'May', saved: 93, lost: 7 },
    { month: 'Jun', saved: 96, lost: 4 }
  ]

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full relative animate-fade-in-up my-4 sm:my-8 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full flex items-center justify-center transition-all hover:scale-110 z-[100]"
          aria-label="Close"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
            <p className="text-sm sm:text-base text-gray-600 font-bengali">বিশ্লেষণ ড্যাশবোর্ড</p>
          </div>

          {/* Time Range Selector */}
          <div className="flex justify-center gap-2 mb-6">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  timeRange === range
                    ? 'bg-lime-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-gradient-to-br from-lime-50 to-lime-100 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1">Total Crops</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCrops}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1">Total Quantity</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalQuantity}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1">Loss Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lossRate}%</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1">Avg Storage</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgStorageDays}d</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1">Alerts Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.alertsResolved}</p>
            </div>
          </div>

          {/* Crop Distribution */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Crop Distribution</h3>
            <div className="space-y-3">
              {cropData.map((crop, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{crop.name}</span>
                    <span className="text-sm text-gray-600">{crop.quantity} kg ({crop.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`${crop.color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${crop.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Performance */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Performance</h3>
            <div className="flex items-end justify-between h-48 gap-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col gap-1 mb-2">
                    <div 
                      className="w-full bg-green-500 rounded-t transition-all duration-500 hover:bg-green-600"
                      style={{ height: `${data.saved * 1.5}px` }}
                      title={`Saved: ${data.saved}%`}
                    ></div>
                    <div 
                      className="w-full bg-red-400 rounded-b transition-all duration-500 hover:bg-red-500"
                      style={{ height: `${data.lost * 5}px` }}
                      title={`Lost: ${data.lost}%`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600">Saved</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span className="text-gray-600">Lost</span>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-6 bg-lime-50 border-2 border-lime-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-lime-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-lime-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Key Insights</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Your success rate improved by 8% this month</li>
                  <li>• Rice storage shows best performance (98% success)</li>
                  <li>• Consider upgrading wheat storage conditions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
