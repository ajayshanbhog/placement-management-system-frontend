import React from 'react';
import './Home.css';
import TypingErasingEffect from './TypingEffect';

const Home = () => {
    return (
        <div className="home" >
            <h2><TypingErasingEffect 
          text="Welcome to PES University Placement Management System !" 
          speed={50} 
          eraseSpeed={30} 
          delay={1000}
        /></h2>
            <p>Your one-stop solution for managing your academic and corporate needs.</p>
        </div>
    );
};

export default Home;
