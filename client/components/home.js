import React from 'react'
import { Link, Route, useParams } from 'react-router-dom'
import Header from './header'

const Dashboard = () => {
  return (
    <div>
      <div id="title">Dashboard</div>
      <Link to="/dashboard/profile/15ef5221-bff1-11e9-954d-2f6ce28e9166">Go To Profile</Link>
      <Link to="/dashboard/main">Go To Main</Link>
    </div>
  )
}

const DashboardMain = () => {
  return (
    <div>
      <div id="title">Dashboard</div>
      <Link to="/dashboard/profile/15ef5221-bff1-11e9-954d-2f6ce28e9166">Go To Profile</Link>
      <Link to="/dashboard">Go To Root</Link>
    </div>
  )
}

const ProfileUser = () => {
  const { user } = useParams()
  return (
    <div>
      <div id="title">Profile</div>
      <div id="username">{user}</div>
      <Link to="/dashboard">Go To Root</Link>
      <Link to="/dashboard/main">Go To Main</Link>
    </div>
  )
}

const Home = () => {
  return (
    <div>
      <Header />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10">
          <Route exact path="/dashboard/" component={() => <Dashboard />} />
          <Route exact path="/dashboard/main" component={() => <DashboardMain />} />
          <Route exact path="/dashboard/profile/:user" component={() => <ProfileUser />} />
        </div>
      </div>
    </div>
  )
}

Home.propTypes = {}

export default React.memo(Home)
