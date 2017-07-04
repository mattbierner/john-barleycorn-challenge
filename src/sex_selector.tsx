import * as React from 'react'


export enum Sex {
    male = "male",
    female = "female"
}

interface SexSelectorProps {
    value: string

    onSexChange: (newSex: Sex) => void
}

export class SexSelector extends React.Component<SexSelectorProps, {}> {
    private onChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        const value = e.target.value
        for (const sex in Sex) {
            if (sex === value) {
                this.props.onSexChange(Sex[sex] as any)
                break
            }
        }
    }

    render() {
        const options: any[] = []
        for (const sex in Sex) {
            options.push(<option key={sex} value={sex}>{sex}</option>)
        }

        return (
            <select value={this.props.value} onChange={this.onChange.bind(this)}>
                {options}
            </select>
        )
    }
} 
