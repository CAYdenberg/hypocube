import React from 'react';
import githubIcon from './components/images/github.svg';

const GithubLink = ({ link, text }) => {
  return (
    <a href={link} className="githubSection">
      <img className="githubIcon" src={githubIcon} alt="github" />
      {text}
    </a>
  );
};

export default GithubLink;
