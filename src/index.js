import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Box extends Component {

    handleClick = () => {
        this.props.onClick(this.props.x, this.props.y);
    }
    render() {
        return <div className={this.props.className} onClick={this.handleClick}></div>
    }
}



const IntervalSlider = (props) => {
    return(
        <input type='range' min='100' max='2000' value={props.intervalTime} onChange={props.change}/>
    )
}

class App extends Component {
    constructor(props) {
        super(props);
        this.width = 80;
        this.height = 80;
        this.interval = null;
        this.intervalTime = 500;
        this.state = {
            fullGrid: this.createGrid()
        }
    }

    createGrid = () => {
        return new Array(this.height).fill(new Array(this.width).fill(false));
    }

    clickHandler = (x, y) => {
        let arrayToPass = JSON.parse(JSON.stringify(this.state.fullGrid));
        arrayToPass[x][y] = !arrayToPass[x][y];
        this.setState({
            fullGrid: arrayToPass
        });
    }

    autoPlay = () =>{
        clearInterval(this.interval);
        this.interval = setInterval(this.play,this.intervalTime);
    }

    stop = () => {
        clearInterval(this.interval);
    }

    clear = () => {
        clearInterval(this.interval);
        this.setState({
            fullGrid: this.createGrid()
        })
    }

    play = () => {

        let arrayToPass = this.state.fullGrid.map(function(arr) {
            return arr.slice();
        });
        let originalArray = arrayToPass.map(function(arr) {
            return arr.slice();
        });

        for (let i = 0; i < arrayToPass.length; i++) {
            for (let j = 0; j < arrayToPass[i].length; j++) {
                let amountOfNeighbours = 0;
                let left = i-1 < 0 ? arrayToPass.length-1 : i-1;
                let right = i+1 >= arrayToPass.length? 0 : i+1;
                let up = j-1 < 0 ? arrayToPass[i].length-1 : j-1;
                let down = j+1 >= arrayToPass[i].length ? 0 : j+1;

                if (originalArray[right][j]){
                    amountOfNeighbours++;
                }
                if (originalArray[left][j]){
                    amountOfNeighbours++;
                }
                if (originalArray[right][down]){
                    amountOfNeighbours++;
                }
                if (originalArray[right][up]){
                    amountOfNeighbours++;
                }
                if (originalArray[left][down]){
                    amountOfNeighbours++;
                }
                if (originalArray[left][up]){
                    amountOfNeighbours++;
                }
                if (originalArray[i][down]){
                    amountOfNeighbours++;
                }
                if (originalArray[i][up]){
                    amountOfNeighbours++;
                }

                if (originalArray[i][j]){
                    if(amountOfNeighbours < 2 || amountOfNeighbours > 3){
                        arrayToPass[i][j] = false;
                    }else{
                        arrayToPass[i][j] = true;
                    }
                }else{
                    if(amountOfNeighbours === 3){
                        arrayToPass[i][j] = true;
                    }
                }
            }
        }

        this.setState({
            fullGrid: arrayToPass,
        })
    }

    onIntervalChange = (ev) => {
        this.intervalTime = ev.target.value;
        this.autoPlay();
    }

    render() {

        return (

            <div>
                <button onClick={this.play}>Play</button>
                <button onClick={this.autoPlay}>AutoPlay</button>
                <button onClick={this.stop}>Stop AutoPlay</button>
                <IntervalSlider intervalTime={this.state.intervalTime} change={this.onIntervalChange}/>
                {this.state.fullGrid.map((element, ind) => {
                    return(
                        <div key={ind}>
                            {element.map((el, i) => {
                            let boxClass = el ? 'checked' : 'unchecked';
                            let boxID = i + '_' + ind;
                            return <Box id={boxID} key={boxID} className={boxClass} x={ind} y={i} onClick={this.clickHandler}/>
                        })}
                        </div>
                    )
                })}
            </div>

        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
