import { useApp } from '../contexts/AppContext'
import { formatDate } from '../utils/formatDate'
import { useCurrentTime } from '../hooks/useCurrentTime'

export default function HomePage() {
  const { user, logout } = useApp()
  const currentTime = useCurrentTime()

  // Mock data - in a real app this would come from an API
  const dashboardData = {
    metrics: [
      {
        title: 'Solar Production',
        value: '2.4 kWh',
        change: '+12%',
        trend: 'up'
      },
      {
        title: 'Wind Generation',
        value: '1.8 kWh',
        change: '+8%',
        trend: 'up'
      },
      {
        title: 'Energy Savings',
        value: '$127.50',
        change: '+15%',
        trend: 'up'
      },
      {
        title: 'Carbon Offset',
        value: '342 kg',
        change: '+5%',
        trend: 'up'
      }
    ]
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="welcome-section">
          <h1>Welcome back,</h1>
          <h2>{user?.name}</h2>
        </div>
        <button className="logout-button" onClick={logout} data-testid="logout-button">Logout</button>
      </header>

      <main className="home-content">
        <div className="dashboard-header">
          <h2>Green Energy Dashboard</h2>
          <p className="dashboard-date">{formatDate(currentTime)}</p>
        </div>

        <div className="metrics-grid">
          {dashboardData.metrics.map((metric, index) => (
            <div key={index} className="metric-card">
              <h3>{metric.title}</h3>
              <p className="metric-value">{metric.value}</p>
              <p className={`metric-change ${metric.trend}`}>{metric.change}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
