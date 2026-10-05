import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
// import { email } from '@config';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  padding: 0;

  @media (max-width: 480px) and (min-height: 700px) {
    padding-bottom: 10vh;
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 10px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .cta-wrapper {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 50px;
    flex-wrap: wrap;
  }

  .projects-link,
  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 0;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>Merhaba, ben</h1>;
  const two = <h2 className="big-heading">Merve Korkmaz.</h2>;
  const three = <h3 className="big-heading">Full-stack web ve mobil uygulamalar geliştiriyorum.</h3>;
  const four = (
    <>
      <p>
        Balıkesir Üniversitesi Bilgisayar Mühendisliği mezunuyum. Vue.js, React ve TypeScript ile kullanıcı odaklı web arayüzleri geliştiriyor; .NET Core ve Node.js ile API tabanlı uygulamalar oluşturuyorum. Profesyonel projelerde admin panelleri, dinamik formlar, rol bazlı ekranlar ve API entegrasyonları üzerinde çalıştım. Web projelerimin yanında React Native ile mobil uygulama geliştirme deneyimine de sahibim.
      </p>
    </>
  );
  const five = (
    <div className="cta-wrapper">
      <a className="projects-link" href="/#projects">
        Projelerimi İncele
      </a>
      <a className="email-link" href="mailto:mervekorkmaz.dev@gmail.com" target="_blank" rel="noreferrer">
        Benimle İletişime Geçin
      </a>
    </div>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
