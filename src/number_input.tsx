import * as React from 'react'
import * as ReactDOM from 'react-dom'


interface NumberInputProps {
    value: number
    min: number
    max: number

    onChange: (newValue: number) => void
}

export default class NumberInput extends React.Component<NumberInputProps, {}> {
    private onChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        const value = +e.target.value
        const rangedValue = Math.max(this.props.min, Math.min(this.props.max, value))
        this.props.onChange(rangedValue)
    }

    render() {
        return (
            <input
                type='number'
                value={this.props.value}
                onChange={this.onChange.bind(this)}
                min={this.props.min}
                max={this.props.max} />
        )
    }
} 
