import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;
const StyledText = styled.div`
  .skills-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 20px;

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  .skill-category {
    h4 {
      margin: 0 0 10px 0;
      color: var(--lightest-slate);
      font-size: var(--fz-sm);
      font-family: var(--font-mono);
      font-weight: 600;
    }
  }

  ul.skills-list {
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 8px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      color: var(--slate);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;
const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      outline: 0;

      &:after {
        top: 15px;
        left: 15px;
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 20px;
      left: 20px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skillCategories = [
    {
      title: 'Frontend',
      skills: [
        'JavaScript, TypeScript',
        'Vue.js, React, Next.js',
        'Pinia, Zustand',
        'HTML5, CSS3',
        'Tailwind CSS, Vuetify',
      ],
    },
    {
      title: 'Backend',
      skills: [
        'C#, ASP.NET Core',
        'Node.js, Express.js',
        'PHP, Laravel',
        'Entity Framework Core',
        'REST API, JWT',
        'Clean Architecture',
      ],
    },
    {
      title: 'Mobil ve Veritabanı',
      skills: [
        'React Native, Expo',
        'Firebase, SQLite',
        'PostgreSQL, MongoDB',
        'SQL Server, MySQL',
      ],
    },
    {
      title: 'Araçlar',
      skills: ['Git, GitHub', 'Postman, Swagger', 'Jira', 'Vercel, Render'],
    },
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">Hakkımda</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Bilgisayar mühendisliği mezunuyum. Vue.js, React ve TypeScript ile kullanıcı odaklı
              web arayüzleri; ASP.NET Core ve Node.js ile API tabanlı full-stack uygulamalar
              geliştiriyorum.
            </p>

            <p>
              Profesyonel projelerde Vue 3, Pinia ve Vuetify kullanarak admin panelleri, dinamik
              formlar, rol bazlı ekranlar ve API entegrasyonları üzerinde çalıştım. Kişisel ve
              teknik değerlendirme projelerimde ise React, .NET 8, Clean Architecture, JWT, Entity
              Framework Core ve veritabanı teknolojileriyle uçtan uca uygulamalar geliştirdim. React
              Native ile mobil uygulama geliştirme deneyimine de sahibim.
            </p>

            <p>Kullandığım teknolojiler:</p>
          </div>

          <div className="skills-container">
            {skillCategories.map((category, i) => (
              <div className="skill-category" key={i}>
                <h4>{category.title}</h4>
                <ul className="skills-list">
                  {category.skills.map((skill, j) => (
                    <li key={j}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/profile.jpeg"
              width={500}
              quality={100}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Headshot"
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
