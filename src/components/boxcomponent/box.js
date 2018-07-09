import React from "react";


export default class Box extends React.Component {

    handleClick = () => {
        this.props.onClick(this.props.x, this.props.y);
    }
    render() {
        return <div className={this.props.className} onClick={this.handleClick}></div>
    }
}