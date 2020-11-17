import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const ProfileTop = ({
  profile: {
    status,
    company,
    location,
    website,
    social,
    user: { name, avatar },
  },
}) => (
  <div className='profile-top bg-primary p-2'>
    <img className='round-img my-1' src={avatar} alt={name} />
    <h1 className='large'>{name}</h1>
    <p className='lead'>
      {status} {company && <span> at {company}</span>}
    </p>
    <p>{location && <span>{location}</span>}</p>
    <div className='icons my-1'>
      {website && (
        <a href={website} target='_blank' rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faGlobe} size='2x' />
        </a>
      )}
      {social && social.twitter && (
        <a href={social.twitter} target='_blank' rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faTwitter} size='2x' />
        </a>
      )}
      {social && social.facebook && (
        <a href={social.facebook} target='_blank' rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faFacebook} size='2x' />
        </a>
      )}
      {social && social.linkedin && (
        <a href={social.linkedin} target='_blank' rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faLinkedin} size='2x' />
        </a>
      )}
      {social && social.youtube && (
        <a href={social.youtube} target='_blank' rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faYoutube} size='2x' />
        </a>
      )}
      {social && social.instagram && (
        <a href={social.instagram} target='_blank' rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faInstagram} size='2x' />
        </a>
      )}
    </div>
  </div>
);

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileTop;
