import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Chart from './chart'
import Visualization from "./visualization";
import { Drink, DrinkSelector, drinks } from "./drink_selector";
import { Sex, SexSelector } from "./sex_selector";
import NumberInput from "./number_input";

const data = require('../data.json')


interface MainState {
    drink: Drink
    sexOfDrinker: Sex
    weightOfDrinker: number
    wordsPerMinute: number
}

class Main extends React.Component<{}, MainState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            drink: drinks[0],

            // Biologically we should probably default to female but Jack London was male so whatever
            sexOfDrinker: Sex.male,
            weightOfDrinker: 70, // kg
            wordsPerMinute: 100
        }
    }

    private onDrinkChange(newDrink: Drink): void {
        this.setState({ drink: newDrink })
        console.log(newDrink.ozOfAlcohol)
    }

    private onSexChange(newSex: Sex): void {
        this.setState({ sexOfDrinker: newSex })
    }

    private onWeightChange(newWeight: number): void {
        this.setState({ weightOfDrinker: newWeight })
    }

    private onWpmChange(newWpm: number): void {
        this.setState({ wordsPerMinute: newWpm })
    }

    render() {
        return (
            <div className='content'>
                <div className='left' style={{ flex: 1 }}>
                    <header>
                        <img src="images/logo.svg" alt="The John Barleycorn Challenge" />
                        <nav>
                            <a href="http://github.com/mattbierner/john-barleycorn-challenge#readme">About</a>
                            <a href="http://github.com/mattbierner/john-barleycorn-challenge">Source</a>
                            <a href="https://blog.mattbierner.com/john-barleycorn">Post</a>
                        </nav>
                    </header>

                    <div className='controls'>
                        What happens when a<br />
                        <NumberInput
                            min={5}
                            max={500}
                            value={this.state.weightOfDrinker}
                            onChange={this.onWeightChange.bind(this)} />kg&nbsp;
                    <SexSelector value={this.state.sexOfDrinker} onSexChange={this.onSexChange.bind(this)} /><br />
                        reads <i>John Barleycorn</i><br /> at <NumberInput
                            min={5}
                            max={1000}
                            value={this.state.wordsPerMinute}
                            onChange={this.onWpmChange.bind(this)} /> WPM<br />
                        taking
                    <DrinkSelector
                            value={this.state.drink.value}
                            onDrinkChange={this.onDrinkChange.bind(this)} /><br />
                        every time "John Barleycorn" appears
                    </div>
                </div>

                <Visualization
                    bodyWeightKg={this.state.weightOfDrinker}
                    precentWater={this.state.sexOfDrinker === 'male' ? 0.58 : 0.49}
                    ouncesEtOH={this.state.drink.ozOfAlcohol}
                    metabolicRate={0.012}
                    wordPerMinute={this.state.wordsPerMinute}
                    totalWordCount={data['total_length']}
                    barleycornIndicies={data['indicies']} />
            </div>
        )
    }
}

ReactDOM.render(
    <Main />,
    document.getElementById('main'))
