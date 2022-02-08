import React from 'react';
import CardsList from './components/CardsList/CardsList';
import Nav from './components/Nav/Nav';
import PageWrapper from './components/UI/PageWrapper/PageWrapper';

const MainPage = () => {
    return (
    <PageWrapper>
        <Nav />
        <CardsList />
    </PageWrapper>
  );
};

export default MainPage;
