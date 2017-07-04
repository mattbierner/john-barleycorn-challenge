import * as React from 'react'

interface NumberInputProps {
    value: number
    min: number
    max: number

    onChange: (newValue: number) => void
}

interface NumberInputState {
    actualValue: number
}

export default class NumberInput extends React.Component<NumberInputProps, NumberInputState> {
    constructor(props: NumberInputProps) {
        super(props)
        this.state = {
            actualValue: props.value
        }
    }

    componentWillReceiveProps(newProps: NumberInputProps) {
        this.setState({ actualValue: newProps.value })
    }

    private onChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        const value = +e.target.value
        if (isNaN(value))
            return

        this.setState({ actualValue: value })
        
        if (value < this.props.min)
            return

        if (value > this.props.max) 
            return

        this.props.onChange(value)
    }

    render() {
        return (
            <input
                type='number'
                value={this.state.actualValue}
                onChange={this.onChange.bind(this)}
                min={this.props.min}
                max={this.props.max} />
        )
    }
} 
