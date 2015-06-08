var React = require('react');


var Popup = React.createClass({
  render: function() {
    return (
      <div className={'panel panel-default ' + this.props.className || ''}>
        {this.props.children}
      </div>
    );
  },
});


Popup.Header = React.createClass({
  render: function() {
    return (
      <div className="panel-heading popup-header">
        {this.props.children}
      </div>
    );
  },
});


module.exports = Popup;
