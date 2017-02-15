import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import CommentBox from './components/CommentBox';
//import GalleryByReactApp from './components/Main';

// Render the main component into the dom
ReactDOM.render(<CommentBox url="data/comments.json"/>, document.getElementById('app'));
