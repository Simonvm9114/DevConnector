import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsDown,
  faThumbsUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { addLike, removeLike, deletePost } from '../../actions/post';

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  post: { _id, text, user, name, avatar, likes, comments, date },
  auth,
  showActions,
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
      {showActions && (
        <Fragment>
          <button
            onClick={() => addLike(_id)}
            type='button'
            className='btn btn-light'
          >
            <FontAwesomeIcon icon={faThumbsUp} />{' '}
            {likes.length > 0 && <span>{likes.length}</span>}
          </button>
          <button
            onClick={() => removeLike(_id)}
            type='button'
            className='btn btn-light'
          >
            <FontAwesomeIcon icon={faThumbsDown} />
          </button>
          <Link to={`/post/${_id}`} className='btn btn-primary'>
            Discussion{' '}
            {comments.length > 0 && (
              <span className='comment-count'>{comments.length}</span>
            )}
          </Link>
          {auth.isAuthenticated && auth.user._id === user && (
            <button
              onClick={() => deletePost(_id)}
              type='button'
              className='btn btn-danger'
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </Fragment>
      )}
    </div>
  </div>
);

PostItem.defaultProps = {
  showActions: true,
};

PostItem.propTypes = {
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
