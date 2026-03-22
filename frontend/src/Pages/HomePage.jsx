import Hero from '../Components/Hero'
import Layout from '../Components/Layout'
import Services from '../Components/Services'
import Categories from '../Components/Categories'
import Offers from '../Components/Offers'
const HomePage = () => {




  return (
    <Layout>
      <Hero />
      <Categories />
      <Services />
      <Offers/>
    </Layout>
  )
}

export default HomePage