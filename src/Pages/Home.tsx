import AllForms from '@/components/AllForms'
import MyForms from '@/components/MyForms'


const Home = () => {
  return (
    <div className="home-container">
      <div className="section my-8">
        <MyForms />
      </div>
      <div className="section my-8">
        <AllForms />
      </div>
    </div>
  )
}

export default Home
