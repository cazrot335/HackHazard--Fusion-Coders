import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import WorkApp from '../components/WorkApp'
import SupportLanguages from '../components/SupportLanguages'
import RealTimeCollaborate from '../components/RealTimeCollaborate'
import Users from '../components/Users'
import CodeControl from '../components/CodeControl'
import TechStacks from '../components/TechStacks'
import FooterSection from '../components/FooterSection'
const Home = () => {
    return (
        <>
            <Header />
            <Hero />
            <Features />
            <WorkApp />
            <SupportLanguages />
            <RealTimeCollaborate />
            <Users />
            <CodeControl />
            <TechStacks />
            <FooterSection />
        </>
    )
}

export default Home
