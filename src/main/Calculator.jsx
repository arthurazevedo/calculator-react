import React, {Component} from 'react';
import './Calculator.css';

import Button from '../components/Button';
import Display from '../components/Display';

const initialState = {
    displayValue: '0',
    clearDisplay: false,
    operation: null,
    values: [0, 0],
    current: 0,
    displayClass: ''
};

export default class Calculator extends Component {
    
    state = { ...initialState };

    clearMemory() {
        this.setState({ ...initialState });
    }
    
    setOperation(operation) {

        // Operation Visual Flag
        const displayClass = 'hide';
        this.setState({displayClass});
        setTimeout(() => this.setState({displayClass: ''}), 160);

        if (this.state.current === 0) {
            this.setState({ operation, current: 1, clearDisplay: true });
        } else {
            const equals = operation === '=';
            const currentOperation = this.state.operation;

            const values = [...this.state.values];
            
            try {
                values[0] = eval(`${values[0]} ${currentOperation} ${values[1]}`);
            } catch (e) {
                values[0] = this.state.values[0];
            }
            
            values[1] = 0;

            this.setState({
                displayValue: values[0],
                operation: equals ? null : operation,
                current: equals ? 0 : 1,
                clearDisplay: !equals,
                values
            });
        }
    }

    addDigit(n) {
        if (n === '.' && this.state.displayValue.includes('.')) return;

        const clearDisplay = (this.state.displayValue === '0' && n !== '.') || this.state.clearDisplay;
        const currentValue = clearDisplay ? '' : this.state.displayValue;
        const displayValue = currentValue + n;

        this.setState({displayValue, clearDisplay: false});

        if (n !== '.') {
            const i = this.state.current;
            const newValue = parseFloat(displayValue);
            const values = [...this.state.values];
            values[i] = newValue;
            this.setState({values});
        }
    }

    renderOption(option) {
        const addDigit = n => this.addDigit(n);
        const setOperation = op => this.setOperation(op);
        let operators = ['=', '/', '*', '-', '+'];
        if ((!isNaN(option) && option !== 0) ||(option === '.')) {
            return <Button key={option} label={option} click={addDigit}/>
        }
        else if (operators.includes(option)){
            return <Button key={option} label={option} click={setOperation} operation/>
        }
        else if (option === 'AC'){
            return <Button key={option} label={option} click={() => this.clearMemory()} triple/>
        }
        else {
            return <Button key={option} label={option} click={addDigit} double/>
        }
    }

    render() {
        const commands = [['AC', '/'], [7, 8, 9, '*'], [4, 5, 6,
            '-'], [1, 2, 3, '+'], [0, '.', '=']];
        return (
            <div className="calculator">
                <Display className={this.state.displayClass} value={this.state.displayValue} />
                
                {commands.map(command => (command.map(option => (
                    this.renderOption(option)
                ))))}

            </div>
        );
    }
}