import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import PageNotFound from './pages/PageNotFound'
import PrivateRoute from './components/Utils/PrivateRoute'
import Dashboard from './pages/Dashboard'
import CourseList from './pages/CourseList'
import CourseContentItem from './pages/CourseContentItem'
import CourseDetails from './pages/CourseDetails'

const Routes = () => (
  <Switch>
    <PrivateRoute path="/dashboard" component={Dashboard} condition />
    <PrivateRoute exact path="/courses" component={CourseList} condition />
    <PrivateRoute
      exact
      path={`/courses/:courseId(\\d+)/modules/:moduleId/items/:itemId`}
      component={CourseContentItem}
      condition
    />
    <PrivateRoute
      path={`/courses/:courseId(\\d+)`}
      condition
      component={CourseDetails}
    />
    <Redirect exact from="/" to="/dashboard" />
    <Route component={PageNotFound} />
  </Switch>
)

export default Routes
