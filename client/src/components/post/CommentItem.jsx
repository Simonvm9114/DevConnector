import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { deleteComment } from '../../actions/post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const CommentItem = ({
  deleteComment,
  auth,
  comment: { _id, text, name, avatar, user, date },
  postId,
}) => (
  <div className='post bg-white p-1 my-1'>
    <div>
      <Link to={`/profile/${user}`}>
        <img className='round-img' src={avatar} alt={name} />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p className='my-1'>{text}</p>
      <p className='post-date'>
        Posted on <Moment format='DD-MM-YYYY'>{date}</Moment>
      </p>
      {!auth.loading && auth.user._id === user && (
        <button
          onClick={() => deleteComment(postId, _id)}
          className='btn btn-danger'
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
    </div>
  </div>
);

CommentItem.propTypes = {};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

export default connect(mapStateToProps, { deleteComment })(CommentItem);
