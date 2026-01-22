// Simple test file for the plus_100 function
const { plus100, add, divide, modulo, multiply, subtract, heavyCalculation } = require('./index.js');

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message + ` | Expected: ${expected}, but got: ${actual}`);
    }

    console.info('✅ Test passed:', message);
}

// function add(n1, n2) {
//     return n1 + n2;
// }

// function add(n1, n2) {
//     return n1 + n2;
// }

// function subtract(n1, n2) {
//     return n1 - n2;
// }

// function multiply(n1, n2) {
//     return n1 * n2;
// }

// function divide(n1, n2) {
//     if (n2 === 0) {
//         throw new Error('Division by zero');
//     }
//     return n1 / n2;
// }

// function heavyCal(n1, n2, func) {
//     let result = 0;
//     for (let i = 0; i < 1_000_000; i++) {
//         result = func(n1, n2);
//     }
//     return result;
// }

// function heavyCalculation(n) {
//     if (n <= 0) return 0;
//     if (n === 1) return 1;
//     return heavyCalculation(n - 1) + heavyCalculation(n - 2);
// }

function fibonacci(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    let fib_array = [0, 1];
    for (let i = 2; i <= n; i++) {
        fib_array[i] = fib_array[i - 1] + fib_array[i - 2];
    }
    return fib_array[n];
}

function runTests() {
    
    function tcAdd(n1, n2) {
        const testCases = [
            { n1: 5, n2: 3, expected: 8 },
            { n1: -2, n2: 2, expected: 0 },
            { n1: 0, n2: 0, expected: 0 },
            { n1: 100, n2: 200, expected: 300 },
        ];

        testCases.forEach(({ n1, n2, expected }) => {
            const result = add(n1, n2);
            assertEqual(result, expected, `add(${n1}, ${n2}) should return ${expected}`);
        });
    }

    function tcSubtract(n1, n2) {
        const testCases = [
            { n1: 5, n2: 3, expected: 2 },
            { n1: -2, n2: 2, expected: -4 },
            { n1: 0, n2: 0, expected: 0 },
            { n1: 100, n2: 50, expected: 50 },
        ];
        
        testCases.forEach(({ n1, n2, expected }) => {
            const result = subtract(n1, n2);
            assertEqual(result, expected, `subtract(${n1}, ${n2}) should return ${expected}`);
        });
    }

    function tcMultiply(n1, n2) {
        const testCases = [
            { n1: 5, n2: 3, expected: 15 },
            { n1: -2, n2: 2, expected: -4 },
            { n1: 0, n2: 100, expected: 0 },
            { n1: 10, n2: 10, expected: 100 },
        ];
        
        testCases.forEach(({ n1, n2, expected }) => {
            const result = multiply(n1, n2);
            assertEqual(result, expected, `multiply(${n1}, ${n2}) should return ${expected}`);
        });
    }

    function tcDivide(n1, n2) {
        const testCases = [
            { n1: 6, n2: 3, expected: 2 },
            { n1: -4, n2: 2, expected: -2 },
            { n1: 0, n2: 100, expected: 0 },
            { n1: 10, n2: 2, expected: 5 },
        ];
        
        testCases.forEach(({ n1, n2, expected }) => {
            const result = divide(n1, n2);
            assertEqual(result, expected, `divide(${n1}, ${n2}) should return ${expected}`);
        });
    }

    function tcFibonacci() {
        const testCases = [
            { n: 0, expected: 0 },
            { n: 1, expected: 1 },
            { n: 2, expected: 1 },
            { n: 3, expected: 2 },
            { n: 4, expected: 3 },
            { n: 5, expected: 5 },
            { n: 6, expected: 8 },
            { n: 7, expected: 13 },
            { n: 8, expected: 21 },
            { n: 9, expected: 34 },
            { n: 90, expected: 2880067194370816120 },

        ];

        testCases.forEach(({ n, expected }) => {
            console.time(`heavyCalculation(${n})`);
            const result = heavyCalculation(n);
            console.timeEnd(`heavyCalculation(${n})`);
            assertEqual(result, expected, `heavyCalculation(${n}) should return ${expected}`);
        });

        testCases.forEach(({ n, expected }) => {
            console.time(`fibonacci(${n})`);
            const result = fibonacci(n);
            console.timeEnd(`fibonacci(${n})`);
            assertEqual(result, expected, `fibonacci(${n}) should return ${expected}`);
        });
    }

    // Run all test suites
    tcAdd();
    tcSubtract();
    tcMultiply();
    tcDivide();
    tcFibonacci();

    console.log('All tests passed!');
}

// Run the tests
try {
    runTests();
} catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
}