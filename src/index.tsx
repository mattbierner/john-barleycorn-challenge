import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Chart from './chart'
import Visualization from "./visualization";

const data = require('../data.json')


class Main extends React.Component<{}, {}> {
    render() {
        return (
            <div>
                <Visualization
                    bodyWeightKg={58.06}
                    precentWater={0.58}
                    ouncesEtOH={1.5 * 0.4}
                    metabolicRate={0.012}
                    wordPerMinute={200}
                    totalWordCount={data['total_length']}
                    barleycornIndicies={data['indicies']} />
            </div>
        )
    }
}

ReactDOM.render(
    <Main />,
    document.getElementById('main'))
