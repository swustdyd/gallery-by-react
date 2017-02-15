/**
 * Created by Aaron on 2017/2/15.
 */
import React from 'react';

var converter = new Showdown.converter();

class Comment extends React.Component{
  render() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}}/>
      </div>
    );
  }
};

class CommentList extends React.Component{
  render() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
};

class CommentForm extends React.Component{
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();
    var author = this.refs['author'].value.trim();
    var text = this.refs['text'].value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.refs['author'].value = '';
    this.refs['text'].value = '';
    return;
  }

  render() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author"/>
        <input type="text" placeholder="Say something..." ref="text"/>
        <input type="submit" value="Post" />
      </form>
    );
  }
};

class CommentBox extends React.Component{
  constructor(props) {
    super(props);
    this.state = {data: []};
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
  }

  loadCommentsFromServer(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        alert(data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    /*var comments = require('../data/comments.json');
    this.setState({data: comments});*/
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  }
  handleCommentSubmit(comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    // TODO: submit to the server and refresh the list
    /*$.ajax({
     url: this.props.url,
     dataType: 'json',
     type: 'POST',
     data: comment,
     success: function(data) {
     this.setState({data: data});
     }.bind(this),
     error: function(xhr, status, err) {
     console.error(this.props.url, status, err.toString());
     }.bind(this)
     });*/
  }

  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
}

export default CommentBox;


