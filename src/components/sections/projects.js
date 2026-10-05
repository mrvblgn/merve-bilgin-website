import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledProjectsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    &:after {
      bottom: 0.1em;
    }
  }

  .projects-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

const StyledProject = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  &.is-clickable {
    cursor: pointer;
  }

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .project-inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: auto;
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 35px;

    .folder {
      color: var(--green);
      svg {
        width: 40px;
        height: 40px;
      }
    }

    .project-links {
      display: flex;
      align-items: center;
      margin-right: -10px;
      color: var(--light-slate);

      .private-badge {
        ${({ theme }) => theme.mixins.flexCenter};
        gap: 6px;
        padding: 6px 10px;
        margin: 0 10px 0 0;
        border-radius: 999px;
        background-color: var(--navy);
        color: var(--lightest-slate);
        font-family: var(--font-mono);
        font-size: var(--fz-xxs);

        svg {
          width: 16px;
          height: 16px;
        }
      }

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .project-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .project-description {
    color: var(--light-slate);
    font-size: 17px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .project-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;

const StyledImageModal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: rgba(2, 12, 27, 0.85);
  backdrop-filter: blur(6px);

  .modal-backdrop {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    border: 0;
    padding: 0;
    margin: 0;
    cursor: pointer;
    z-index: 0;
  }

  .modal-content {
    position: relative;
    max-width: min(1000px, 92vw);
    max-height: 85vh;
    z-index: 1;
  }

  .modal-image {
    display: block;
    max-width: 100%;
    max-height: 85vh;
    border-radius: var(--border-radius);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  }

  .modal-close,
  .modal-nav {
    position: absolute;
    width: 36px;
    height: 36px;
    border-radius: 999px;
    border: 0;
    cursor: pointer;
    background: var(--light-navy);
    color: var(--lightest-slate);
    font-size: 20px;
    line-height: 1;
    display: grid;
    place-items: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  }

  .modal-close {
    top: -12px;
    right: -12px;
  }

  .modal-nav {
    top: 50%;
    transform: translateY(-50%);
  }

  .modal-prev {
    left: -18px;
  }

  .modal-next {
    right: -18px;
  }
`;

const Projects = () => {
  const data = useStaticQuery(graphql`
    query {
      projects: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/projects/" }
          frontmatter: { showInProjects: { ne: false } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              tech
              github
              external
              private
              coverUrl
              gallery
              cover {
                childImageSharp {
                  gatsbyImageData(width: 1200, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
                }
              }
            }
            html
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeGallery, setActiveGallery] = useState(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 3;
  const projects = data.projects.edges.filter(({ node }) => node);
  const firstSix = projects.slice(0, GRID_LIMIT);
  const projectsToShow = showMore ? projects : firstSix;

  const projectInner = node => {
    const { frontmatter, html } = node;
    const { github, external, title, tech, private: isPrivate } = frontmatter;

    return (
      <div className="project-inner">
        <header>
          <div className="project-top">
            <div className="folder">
              <Icon name="Folder" />
            </div>
            <div className="project-links">
              {isPrivate && (
                <span className="private-badge" aria-label="Private Repository">
                  <Icon name="Lock" />
                  Private Repo
                </span>
              )}
              {github && (
                <a href={github} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                  <Icon name="GitHub" />
                </a>
              )}
              {external && (
                <a
                  href={external}
                  aria-label="External Link"
                  className="external"
                  target="_blank"
                  rel="noreferrer">
                  <Icon name="External" />
                </a>
              )}
            </div>
          </div>

          <h3 className="project-title">
            <a href={external} target="_blank" rel="noreferrer">
              {title}
            </a>
          </h3>

          <div className="project-description" dangerouslySetInnerHTML={{ __html: html }} />
        </header>

        <footer>
          {tech && (
            <ul className="project-tech-list">
              {tech.map((tech, i) => (
                <li key={i}>{tech}</li>
              ))}
            </ul>
          )}
        </footer>
      </div>
    );
  };

  return (
    <StyledProjectsSection>
      <h2 ref={revealTitle}>Diğer Önemli Projeler</h2>

      {/* <Link className="inline-link archive-link" to="/archive" ref={revealArchiveLink}>
        view the archive
      </Link> */}

      <ul className="projects-grid">
        {prefersReducedMotion ? (
          <>
            {projectsToShow &&
              projectsToShow.map(({ node }, i) => {
                const { cover, coverUrl, gallery, title } = node.frontmatter;
                const image = getImage(cover);
                const coverSrc = image?.images?.fallback?.src || coverUrl;
                const images =
                  Array.isArray(gallery) && gallery.length ? gallery : coverSrc ? [coverSrc] : [];
                const handleCardClick = e => {
                  if (!images.length) {
                    return;
                  }

                  const linkEl = e.target.closest('a');
                  if (linkEl) {
                    const href = linkEl.getAttribute('href');
                    if (href && href !== '#') {
                      return;
                    }
                  }

                  setActiveGallery({ images, index: 0, alt: title });
                };

                const isClickable = images.length > 0;

                return (
                  <StyledProject
                    key={i}
                    onClick={isClickable ? handleCardClick : undefined}
                    onKeyDown={
                      isClickable
                        ? e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleCardClick(e);
                          }
                        }
                        : undefined
                    }
                    role={isClickable ? 'button' : undefined}
                    tabIndex={isClickable ? 0 : undefined}
                    className={isClickable ? 'is-clickable' : undefined}>
                    {projectInner(node)}
                  </StyledProject>
                );
              })}
          </>
        ) : (
          <TransitionGroup component={null}>
            {projectsToShow &&
              projectsToShow.map(({ node }, i) => {
                const { cover, coverUrl, gallery, title } = node.frontmatter;
                const image = getImage(cover);
                const coverSrc = image?.images?.fallback?.src || coverUrl;
                const images =
                  Array.isArray(gallery) && gallery.length ? gallery : coverSrc ? [coverSrc] : [];
                const handleCardClick = e => {
                  if (!images.length) {
                    return;
                  }

                  const linkEl = e.target.closest('a');
                  if (linkEl) {
                    const href = linkEl.getAttribute('href');
                    if (href && href !== '#') {
                      return;
                    }
                  }

                  setActiveGallery({ images, index: 0, alt: title });
                };

                const isClickable = images.length > 0;

                return (
                  <CSSTransition
                    key={i}
                    classNames="fadeup"
                    timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                    exit={false}>
                    <StyledProject
                      key={i}
                      ref={el => (revealProjects.current[i] = el)}
                      onClick={isClickable ? handleCardClick : undefined}
                      onKeyDown={
                        isClickable
                          ? e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleCardClick(e);
                            }
                          }
                          : undefined
                      }
                      role={isClickable ? 'button' : undefined}
                      tabIndex={isClickable ? 0 : undefined}
                      className={isClickable ? 'is-clickable' : undefined}
                      style={{
                        transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                      }}>
                      {projectInner(node)}
                    </StyledProject>
                  </CSSTransition>
                );
              })}
          </TransitionGroup>
        )}
      </ul>

      {activeGallery && (
        <StyledImageModal role="dialog" aria-modal="true">
          <button
            type="button"
            className="modal-backdrop"
            aria-label="Close image"
            onClick={() => setActiveGallery(null)}
          />
          <div className="modal-content">
            <button
              type="button"
              className="modal-close"
              aria-label="Close image"
              onClick={() => setActiveGallery(null)}>
              ×
            </button>
            {activeGallery.images.length > 1 && (
              <>
                <button
                  type="button"
                  className="modal-nav modal-prev"
                  aria-label="Previous image"
                  onClick={() =>
                    setActiveGallery(current => ({
                      ...current,
                      index: current.index === 0 ? current.images.length - 1 : current.index - 1,
                    }))
                  }>
                  ‹
                </button>
                <button
                  type="button"
                  className="modal-nav modal-next"
                  aria-label="Next image"
                  onClick={() =>
                    setActiveGallery(current => ({
                      ...current,
                      index: current.index === current.images.length - 1 ? 0 : current.index + 1,
                    }))
                  }>
                  ›
                </button>
              </>
            )}
            <img
              className="modal-image"
              src={activeGallery.images[activeGallery.index]}
              alt={activeGallery.alt}
            />
          </div>
        </StyledImageModal>
      )}

      <button className="more-button" onClick={() => setShowMore(!showMore)}>
        Daha {showMore ? 'Az' : 'Fazla'}
      </button>
    </StyledProjectsSection>
  );
};

export default Projects;
