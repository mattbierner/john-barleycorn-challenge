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
            wordsPerMinute: 200
        }
    }

    private onDrinkChange(newDrink: Drink): void {
        this.setState({ drink: newDrink })
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
            <div>
                <div>
                    A
                    <NumberInput
                        min={1}
                        max={500}
                        value={this.state.weightOfDrinker}
                        onChange={this.onWeightChange.bind(this)} />kg
                    <SexSelector value={this.state.sexOfDrinker} onSexChange={this.onSexChange.bind(this)} />
                    drinking
                    <DrinkSelector
                        value={this.state.drink.value}
                        onDrinkChange={this.onDrinkChange.bind(this)} />
                    everytime 'John Barleycorn' appears in the text of 'John Barleycorn' at
                    <NumberInput 
                        min={5}
                        max={400}
                        value={this.state.wordsPerMinute}
                        onChange={this.onWpmChange.bind(this)} />

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
