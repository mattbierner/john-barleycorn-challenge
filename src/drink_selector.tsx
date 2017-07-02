import * as React from 'react'
import * as ReactDOM from 'react-dom'

export interface Drink {
    value: string
    label: string
    ozOfAlcohol: number
}

export const drinks: Drink[] = [
    {
        value: '80_proof_whiskey_shot',
        label: 'a shot of 80 proof whiskey',
        ozOfAlcohol: 1.5 /*oz*/ * 0.4 /* % */
    },
    {
        value: 'pint_beer',
        label: 'a pint of beer',
        ozOfAlcohol: 16 /*oz*/ * 0.05 /* % */
    },
    {
        value: 'sip_wine',
        label: 'a big sip of wine ',
        ozOfAlcohol: 0.54 /*oz*/ * 0.10 /* % */
    },
    {
        value: 'aquarium',
        label: 'an aquarium of Pabst',
        ozOfAlcohol: 128 /*oz*/ *  0.0474 /* % */
    },
      {
        value: 'dry_martini',
        label: 'a dry martini',
        ozOfAlcohol: (1.5 /*oz*/ *  0.45 /* % */) + (1.5 /*oz*/ *  0.16 /* % */)
    }
];

interface DrinkSelectorProps {
    value: string

    onDrinkChange: (newDrink: Drink) => void
}

export class DrinkSelector extends React.Component<DrinkSelectorProps, {}> {
    private onChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        const value = e.target.value
        for (const drink of drinks) {
            if (drink.value === value) {
                this.props.onDrinkChange(drink)
                break
            }
        }
    }

    render() {
        const options = drinks.map(drink =>
            <option key={drink.value} value={drink.value}>{drink.label}</option>
        )

        return (
            <select value={this.props.value} onChange={this.onChange.bind(this)}>
                {options}
            </select>
        )
    }
} 
