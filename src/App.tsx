import React from 'react'
const ApplicantLayout = React.lazy(() => import('./components/Applicant/Layout'))
function App() {
  return (
    <>
      <ApplicantLayout />
    </>
  )
}

export default App
