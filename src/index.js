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
            this.width = 50;
            this.height = 20;
            this.interval = null;
            this.intervalTime = 500;
            this.state = {
                fullGrid: this.createGrid(),
                generations: 0
            }
        }

        createGrid = () => {
            return new Array(this.height).fill(new Array(this.width).fill(false));
        }

        clickHandler = (x, y) => {
            let arrayToPass = this.state.fullGrid.map(function(arr) {
                return arr.slice();
            });
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
                fullGrid: this.createGrid(),
                generations: 0,
            })
        }

        play = () => {

            let arrayToPass = this.state.fullGrid.map(function(arr) {
                return arr.slice();
            });
            let originalArray = arrayToPass.map(function(arr) {
                return arr.slice();
            });
            let bGameState = false;
            console.time('forloopz')
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
                            bGameState = true;
                        }
                    }
                }
            }
            console.timeEnd('forloopz');
            let gen = this.state.generations+1;
            this.setState({
                fullGrid: arrayToPass,
                generations: gen,
            });
            if (!bGameState) {
                this.stop();
            }
        }

        onIntervalChange = (ev) => {
            this.intervalTime = ev.target.value;
            this.autoPlay();
        }

        render() {

            return (

                <div id='content'>
                    <h1>Conway's Game of Life </h1>
                    <button onClick={this.play}>Play</button>
                    <button onClick={this.autoPlay}>AutoPlay</button>
                    <button onClick={this.stop}>Stop AutoPlay</button>
                    <button onClick={this.clear}>Reset</button>
                    <IntervalSlider intervalTime={this.state.intervalTime} change={this.onIntervalChange}/>
                    <div id="gridWrapper">
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
                    <p>Generations: {this.state.generations}</p>
                </div>

            )
        }
    }

    ReactDOM.render(<App />, document.getElementById('root'));
