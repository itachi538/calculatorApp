import React, { useState, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
}

type Operator = '+' | '-' | '×' | '÷' | null;

const CalculatorButton: React.FC<ButtonProps> = React.memo(
  ({ title, onPress, style }) => (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
);

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState<boolean>(false);

  const handleNumber = useCallback(
    (num: string): void => {
      if (display === '0' || shouldResetDisplay) {
        setDisplay(num);
        setShouldResetDisplay(false);
      } else {
        setDisplay(display + num);
      }
    },
    [display, shouldResetDisplay]
  );

  const handleOperator = useCallback(
    (op: Operator): void => {
      const current = parseFloat(display);

      if (previousValue === null) {
        setPreviousValue(current);
      } else if (operator) {
        const result = calculate(previousValue, current, operator);
        setPreviousValue(result);
        setDisplay(String(result));
      }

      setOperator(op);
      setShouldResetDisplay(true);
    },
    [display, previousValue, operator]
  );

  const calculate = (a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b !== 0 ? a / b : 0;
      default:
        return b;
    }
  };

  const handleEqual = useCallback((): void => {
    if (operator && previousValue !== null) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operator);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperator(null);
      setShouldResetDisplay(true);
    }
  }, [display, previousValue, operator]);

  const handleClear = useCallback((): void => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setShouldResetDisplay(false);
  }, []);

  const buttonRows = useMemo(
    () => [
      [
        { title: 'C', onPress: handleClear, style: styles.functionButton },
        {
          title: '±',
          onPress: () => setDisplay(String(-parseFloat(display))),
          style: styles.functionButton,
        },
        {
          title: '%',
          onPress: () => setDisplay(String(parseFloat(display) / 100)),
          style: styles.functionButton,
        },
        {
          title: '÷',
          onPress: () => handleOperator('÷'),
          style: styles.operatorButton,
        },
      ],
      [
        { title: '7', onPress: () => handleNumber('7') },
        { title: '8', onPress: () => handleNumber('8') },
        { title: '9', onPress: () => handleNumber('9') },
        {
          title: '×',
          onPress: () => handleOperator('×'),
          style: styles.operatorButton,
        },
      ],
      [
        { title: '4', onPress: () => handleNumber('4') },
        { title: '5', onPress: () => handleNumber('5') },
        { title: '6', onPress: () => handleNumber('6') },
        {
          title: '-',
          onPress: () => handleOperator('-'),
          style: styles.operatorButton,
        },
      ],
      [
        { title: '1', onPress: () => handleNumber('1') },
        { title: '2', onPress: () => handleNumber('2') },
        { title: '3', onPress: () => handleNumber('3') },
        {
          title: '+',
          onPress: () => handleOperator('+'),
          style: styles.operatorButton,
        },
      ],
      [
        {
          title: '0',
          onPress: () => handleNumber('0'),
          style: styles.zeroButton,
        },
        { title: '.', onPress: () => handleNumber('.') },
        { title: '=', onPress: handleEqual, style: styles.equalButton },
      ],
    ],
    [handleNumber, handleOperator, handleEqual, handleClear, display]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {previousValue !== null && operator
            ? `${previousValue} ${operator}`
            : ''}
        </Text>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        {buttonRows.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((button, j) => (
              <CalculatorButton key={j} {...button} />
            ))}
          </View>
        ))}
      </View>
      <Text style={styles.signature}>Calc by Devashish</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C',
  },
  displayContainer: {
    flex: 0.3,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: '#2C2C2C',
  },
  displayText: {
    fontSize: 70,
    color: '#FF9F1C',
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-light',
  },
  buttonsContainer: {
    flex: 0.7,
    padding: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9F1C',
    borderRadius: 25,
    margin: 5,
    aspectRatio: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 30,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-light',
  },
  operatorButton: {
    backgroundColor: '#FF9F1C',
  },
  functionButton: {
    backgroundColor: '#FF9F1C',
  },
  equalButton: {
    backgroundColor: '#1B998B',
  },
  equalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  zeroButton: {
    flex: 2.2,
    aspectRatio: 2.2,
  },
  signature: {
    color: '#FF9F1C',
    textAlign: 'center',
    paddingBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-light',
  },
});

export default Calculator;