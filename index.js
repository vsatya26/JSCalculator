
// Calculate function with 3 parameters to compute the arithmetic operation
const calculate = (n1, operator, n2) => {
  //Converting String to float
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);

  if (operator === 'add') return firstNum + secondNum
  if (operator === 'subtract') return firstNum - secondNum
  if (operator === 'multiply') return firstNum * secondNum
  if (operator === 'divide') 
  //Alert user when divide by Zero.
  {
      if(secondNum == 0) {
          return "Do not try to divide by Zero!";
      }
      return firstNum / secondNum;
  }
}

//Assigning the 'action' object with 'operator' or 'number' or 'action'( for '.' or '=' or 'AC' or 'CE')
const getKeyType = key => {
  const { action } = key.dataset
  if (!action) return 'number'
  if (
    action === 'add' ||
    action === 'subtract' ||
    action === 'multiply' ||
    action === 'divide'
  ) return 'operator'
  // For everything else, return the action
  return action
}

//Assigning 'state' object with corresponding string values for firstValue, operator, modValue and previousKeyType.
const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent
  const keyType = getKeyType(key)
  const {
    firstValue,
    operator,
    modValue,
    previousKeyType
  } = state

  if (keyType === 'number') {
    return displayedNum === '0' ||
      previousKeyType === 'operator' ||
      previousKeyType === 'calculate'
      ? keyContent
      : displayedNum + keyContent
  }

  //Prefix with 0 to decimal number < 1 or return the displayed decimal number
  if (keyType === 'decimal') {
    if (!displayedNum.includes('.')) return displayedNum + '.'
    if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.'
    return displayedNum
  }

  //To check if previousKeyType is not an 'operator' and 'calculate'
  if (keyType === 'operator') {
    return firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum
  }

  // To display 0 in the display area on click on 'AC'
  if (keyType === 'clear') return 0

  //When on click of '=' , assigning 'displayedNum' to firstValue, else assign the previous calculated result value to firstNum
  //else assign the calculated value to firstNum. 
  if (keyType === 'calculate') {
    return firstValue
      ? previousKeyType === 'calculate'
        ? calculate(displayedNum, operator, modValue)
        : calculate(firstValue, operator, displayedNum)
      : displayedNum
  }
}

//Update the Calculator state function.
const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
  //Call getKeyType function to assign keyType as 'operator' or 'number' or 'action'( for '.' or '=' or 'AC' or 'CE')
  const keyType = getKeyType(key)
   const {
    firstValue,
    operator,
    modValue,
    previousKeyType
  } = calculator.dataset

  //Assigning keyType value to previousKeyType
  calculator.dataset.previousKeyType = keyType
  
  //Assigning value for fistValue as calculatedValue or the displayed number
  if (keyType === 'operator') {
    calculator.dataset.operator = key.dataset.action
    calculator.dataset.firstValue = firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculatedValue
      : displayedNum
  }

  //Saving the secondValue in temporary modValue if '=' is pressed after calculation or assign the displayedNum to modValue
  if (keyType === 'calculate') {
    calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
      ? modValue
      : displayedNum
  }

  //Intial state of calculator(without pressing any number or opertor keys) or clearing the firstValue, modValue, operator and 
  // previousKeyType, after calculating the result.
  if (keyType === 'clear' && key.textContent === 'AC') {
    calculator.dataset.firstValue = ''
    calculator.dataset.modValue = ''
    calculator.dataset.operator = ''
    calculator.dataset.previousKeyType = ''
  }
}

//Update Visual State of the calculator function.
const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key)
  //Removing the 'is-depressed' from classList after firstValue and operator is pressed.
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))

  //Adding 'is-depressed' classList when user clicks the operator key.
  if (keyType === 'operator') key.classList.add('is-depressed')

  if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC'

  //Changing the 'AC' button to 'CE' when the uer has clicked a number key and operator key.
  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]')
    clearButton.textContent = 'CE'
  }
}

//Creating and assign variables calculator, display and keys using querySelector.
const calculator = document.querySelector('.calculator')
const display = calculator.querySelector('.calculator__display')
const keys = calculator.querySelector('.calculator__keys')

//Adding event listener to buttons and creating the result string to be displayed.
keys.addEventListener('click', e => {
  if (!e.target.matches('button')) return
  const key = e.target
  const displayedNum = display.textContent
  const resultString = createResultString(key, displayedNum, calculator.dataset)

  display.textContent = resultString
  updateCalculatorState(key, calculator, resultString, displayedNum)
  updateVisualState(key, calculator)
})
